// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getDatabase } from "firebase/database";
// import { getStorage } from "firebase/storage";

// // Initialize Firebase
// const app = initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
// },'admin');

// // Initialize services
// export const auth = getAuth(app);
// export const db = getFirestore(app); // For structured data (users, buses)
// export const rtdb = getDatabase(app); // For real-time bus tracking
// // export const storage = getStorage(app); // For storing RFID card photos

// // Initialize Analytics only in production
// let analytics;
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
//   const { getAnalytics } = await import("firebase/analytics");
//   analytics = getAnalytics(app);
// }
// export { analytics };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}, 'admin');

export const auth = getAuth(app);
export const db = getFirestore(app);       // Firestore for transactions, buses metadata
export const rtdb = getDatabase(app);      // Realtime DB for live location tracking
// export const storage = getStorage(app); // if needed

// Initialize Analytics only in production
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}
export { analytics };
