import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Setup basic Firebase Web JS initialization scaffolding exporting 'auth' and 'db' references using standard developer placeholders.
// This allows the prototype to remain crash-proof and run client-side perfectly.
const firebaseConfig = {
  apiKey: "AIzaSyFakePlaceholderApiKeyGoesHere123",
  authDomain: "bolo-english-applet.firebaseapp.com",
  projectId: "bolo-english-applet",
  storageBucket: "bolo-english-applet.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:fakeappid789abcde"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
