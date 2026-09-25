import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
// Supports:
// 1. FIREBASE_SERVICE_ACCOUNT (raw JSON string or base64 encoded JSON string)
// 2. Google Application Default Credentials (e.g. in GCP / Cloud Run environment)
// 3. Fallback projectId from FIREBASE_PROJECT_ID or VITE_FIREBASE_PROJECT_ID
if (!admin.apps.length) {
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
      admin.initializeApp({
        credential: admin.credential.cert(parsedCredentials),
        projectId: parsedCredentials.project_id || projectId,
      });
    } else {
      // Use application default credentials or project config
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: projectId || undefined,
      });
    }
  } catch (err) {
    console.warn('[Server] Firebase Admin initialization notice:', err.message);
    // If applicationDefault() fails (e.g. locally without ADC credentials file), initialize with projectId only
    if (!admin.apps.length) {
      const fallbackProjectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
      admin.initializeApp({
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
    const decodedToken = await admin.auth().verifyIdToken(idToken);

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

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

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

  if (!isProduction) {
    // Development mode: Mount Vite middleware
    const vite = await createViteServer({
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

startServer();
