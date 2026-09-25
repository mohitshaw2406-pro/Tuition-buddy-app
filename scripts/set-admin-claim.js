import admin from 'firebase-admin';

/**
 * Initializes Firebase Admin SDK using the same credentials logic as server.js:
 * 1. FIREBASE_SERVICE_ACCOUNT (raw JSON string or base64-encoded string)
 * 2. Google Application Default Credentials (e.g. in GCP / Cloud Run environment)
 * 3. Fallback to FIREBASE_PROJECT_ID or VITE_FIREBASE_PROJECT_ID
 */
function initAdmin() {
  if (!admin.apps.length) {
    try {
      const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

      if (rawServiceAccount) {
        let parsedCredentials;
        try {
          parsedCredentials = JSON.parse(rawServiceAccount);
        } catch {
          const decoded = Buffer.from(rawServiceAccount, 'base64').toString('utf8');
          parsedCredentials = JSON.parse(decoded);
        }
        admin.initializeApp({
          credential: admin.credential.cert(parsedCredentials),
          projectId: parsedCredentials.project_id || projectId,
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: projectId || undefined,
        });
      }
    } catch (err) {
      if (!admin.apps.length) {
        const fallbackProjectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
        admin.initializeApp({
          projectId: fallbackProjectId || undefined,
        });
      }
    }
  }
  return admin;
}

async function main() {
  const target = process.argv[2]?.trim();

  if (!target) {
    console.error('Usage: node scripts/set-admin-claim.js <admin-email-or-uid>');
    process.exit(1);
  }

  const fbAdmin = initAdmin();

  let userRecord;
  try {
    if (target.includes('@')) {
      userRecord = await fbAdmin.auth().getUserByEmail(target);
    } else {
      userRecord = await fbAdmin.auth().getUser(target);
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
    await fbAdmin.auth().setCustomUserClaims(userRecord.uid, updatedClaims);
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
