import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin only once
if (!getApps().length) {
  try {
    // Attempt to load from a local service account file first (as requested by user)
    // NOTE: Make sure this file is placed in the root of your project and named 'serviceAccountKey.json'
    // It is already ignored in .gitignore for security.
    const keyPath = path.join(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin Initialized from serviceAccountKey.json');
    } else {
      throw new Error('serviceAccountKey.json not found locally');
    }
  } catch (error) {
    // Fallback to Environment Variables if the file is not found (Production mode)
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle newline characters in the private key from env variables
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin Initialized from Environment Variables');
    } else {
      console.warn('Firebase Admin Initialization Failed: No serviceAccountKey.json found, and env variables are missing.');
    }
  }
}

const adminDb = getApps().length ? getFirestore() : null;
const adminAuth = getApps().length ? getAuth() : null;

export { adminDb, adminAuth };
