/**
 * Firebase initialisation.
 *
 * All config values are read from environment variables so credentials are
 * never hard-coded.  When any variable is missing the module exports `null`
 * and the rest of the app falls back to localStorage (single-device mode).
 *
 * Required env vars (prefix NEXT_PUBLIC_ so the browser can read them):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_DATABASE_URL   ← Realtime Database URL
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function isConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId
  );
}

let app: FirebaseApp | null = null;
let db: Database | null = null;

if (isConfigured()) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  db = getDatabase(app);
}

export { db };
export const firebaseReady = isConfigured();
