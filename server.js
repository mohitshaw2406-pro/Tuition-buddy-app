import express from 'express';
import cors from 'cors';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env/.env (fallback to default .env if not found)
dotenv.config({ path: path.resolve(process.cwd(), '.env/.env') });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
// Supports:
// 1. FIREBASE_SERVICE_ACCOUNT (raw JSON string or base64 encoded JSON string)
// 2. Google Application Default Credentials (e.g. in GCP / Cloud Run environment)
// 3. Fallback projectId from FIREBASE_PROJECT_ID or VITE_FIREBASE_PROJECT_ID
if (!getApps().length) {
  try {
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

    if (rawServiceAccount) {
      let parsedCredentials;
      try {
        parsedCredentials = JSON.parse(rawServiceAccount);
      } catch {
        // Try decoding from base64 if not plain JSON
        const decoded = Buffer.from(rawServiceAccount, 'base64').toString('utf8');
        parsedCredentials = JSON.parse(decoded);
      }
      initializeApp({
        credential: cert(parsedCredentials),
        projectId: parsedCredentials.project_id || projectId,
      });
    } else {
      let initialized = false;
      try {
        const appDefaultCred = applicationDefault();
        if (appDefaultCred) {
          initializeApp({
            credential: appDefaultCred,
            projectId: projectId || undefined,
          });
          initialized = true;
        }
      } catch {
        // applicationDefault credentials not present in local environment
      }

      if (!initialized) {
        initializeApp({
          projectId: projectId || undefined,
        });
      }
    }
  } catch (err) {
    console.warn('[Server] Firebase Admin initialization notice:', err.message);
    if (!getApps().length) {
      const fallbackProjectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
      initializeApp({
        projectId: fallbackProjectId || undefined,
      });
    }
  }
}

/**
 * Protected middleware: requireAdmin
 * - Reads Authorization: Bearer <Firebase ID token>
 * - Verifies the token with Firebase Admin SDK
 * - Requires decodedToken.admin === true
 * - Returns 401 for missing/invalid tokens
 * - Returns 403 when the verified user is not an admin
 * - Attaches verified decoded token to req.adminUser
 */
export async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Missing or malformed Authorization header. Expected Bearer <Firebase ID token>',
    });
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  if (!idToken) {
    return res.status(401).json({
      error: 'Empty Bearer token provided',
    });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);

    if (decodedToken.admin !== true) {
      return res.status(403).json({
        error: 'Forbidden: Admin privileges required',
      });
    }

    req.adminUser = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired Firebase ID token',
      details: err.message,
    });
  }
}

export function createExpressApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // GET /api/admin/verify
  // Protected by requireAdmin. Returns minimal safe identity information.
  app.get('/api/admin/verify', requireAdmin, (req, res) => {
    res.json({
      authorized: true,
      uid: req.adminUser.uid,
      admin: true,
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // POST /api/chat - Server-side proxy for Groq API keeping GROQ_API_KEY secure
  app.post('/api/chat', async (req, res) => {
    const { messages, system, max_tokens } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages must be an array' });
    }

    if (system !== undefined && typeof system !== 'string') {
      return res.status(400).json({ error: 'Invalid request: system must be a string if provided' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'AI service is temporarily unavailable' });
    }

    // Sanitize messages: only accept role and content strings
    const sanitizedMessages = [];
    if (system) {
      sanitizedMessages.push({ role: 'system', content: String(system) });
    }

    for (const msg of messages) {
      if (msg && typeof msg === 'object' && typeof msg.content === 'string') {
        const role = msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user';
        sanitizedMessages.push({ role, content: msg.content });
      }
    }

    // Limit max_tokens to a sensible upper bound (default 1500, max 2048)
    const tokenLimit = typeof max_tokens === 'number' && max_tokens > 0 ? Math.min(Math.floor(max_tokens), 2048) : 1500;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      const upstreamRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: tokenLimit,
          messages: sanitizedMessages,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!upstreamRes.ok) {
        const status = upstreamRes.status;
        if (status === 429) {
          return res.status(429).json({ error: 'Rate limit exceeded. Please try again shortly.' });
        }
        if (status === 401 || status === 403) {
          return res.status(502).json({ error: 'AI authentication error. Please contact administrator.' });
        }
        return res.status(502).json({ error: 'Upstream AI service error' });
      }

      const data = await upstreamRes.json();
      return res.json(data);
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === 'AbortError') {
        return res.status(504).json({ error: 'AI request timed out. Please try again.' });
      }
      return res.status(500).json({ error: 'Failed to process AI chat request' });
    }
  });

  return app;
}

export const app = createExpressApp();

async function startServer() {
  const app = createExpressApp();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: Mount Vite middleware dynamically so Vite/Rolldown is never imported in production/serverless
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Tuition Buddy server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

// Only start the standalone HTTP listener if executed directly (e.g. `node server.js`), not in Vercel serverless environment
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectExecution && process.env.VERCEL !== '1') {
  startServer();
}