import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Backend API base URL (Vite env var)
const API_BASE = import.meta.env.VITE_API_URL;

// Auth helper exports (unchanged)
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);

// --- Code-based email verification (replaces the old Firebase link-based sendEmailVerification) ---

// Asks the backend to generate a 6-digit code, store it (with expiry) against
// this user, and email it to them.
export const sendVerificationCode = async (user) => {
  const res = await fetch(`${API_BASE}/api/auth/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, uid: user.uid }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to send verification code.");
  }

  return res.json();
};

// Sends the code the user typed in to the backend for checking.
// Expected backend response: { success: true } or { success: false, message }
export const verifyEmailCode = async (email, code) => {
  const res = await fetch(`${API_BASE}/api/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.message || "Invalid or expired code." };
  }

  return res.json();
};

console.log("Loaded Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);