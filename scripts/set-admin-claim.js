import path from 'path';
import dotenv from 'dotenv';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Load environment variables from the project's actual env file: .env/.env (fallback to default .env if not found)
dotenv.config({ path: path.resolve(process.cwd(), '.env/.env') });
dotenv.config();

// Explicitly read project ID from environment
const resolvedProjectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

/**
 * Initializes Firebase Admin SDK using modern ESM modular imports:
 * 1. Checks getApps().length to avoid re-initialization
 * 2. Uses resolvedProjectId from VITE_FIREBASE_PROJECT_ID / FIREBASE_PROJECT_ID
 * 3. Uses service account credentials if provided, otherwise applicationDefault() or direct projectId
 */
function initAdmin() {
  if (!getApps().length) {
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = resolvedProjectId;

    if (rawServiceAccount) {
      let parsedCredentials;
      try {
        parsedCredentials = JSON.parse(rawServiceAccount);
      } catch {
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
  }
  return getAuth();
}

async function main() {
  const target = process.argv[2]?.trim();

  if (!target) {
    console.error('Usage: node scripts/set-admin-claim.js <admin-email-or-uid>');
    process.exit(1);
  }

  const auth = initAdmin();

  let userRecord;
  try {
    if (target.includes('@')) {
      userRecord = await auth.getUserByEmail(target);
    } else {
      userRecord = await auth.getUser(target);
    }
  } catch (err) {
    console.error(`Failed to find user by "${target}":`, err.message);
    process.exit(1);
  }

  // Preserve any existing custom claims instead of overwriting unrelated claims
  const existingClaims = userRecord.customClaims || {};
  const updatedClaims = {
    ...existingClaims,
    admin: true,
  };

  try {
    await auth.setCustomUserClaims(userRecord.uid, updatedClaims);
    console.log(`Success: Assigned { admin: true } claim to user.`);
    console.log(`Target UID: ${userRecord.uid}`);
    console.log(`Has Admin Claim: true`);
    console.log(`Note: The user must sign in again or refresh their ID token (getIdTokenResult(true)) for the claim to take effect.`);
  } catch (err) {
    console.error('Failed to set custom claim:', err.message);
    process.exit(1);
  }
}

main();

