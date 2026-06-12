import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDummyKey-For-UI-Scaffolding",
  authDomain: "kicksync-app.firebaseapp.com",
  projectId: "kicksync-app",
  storageBucket: "kicksync-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export { db, auth };
