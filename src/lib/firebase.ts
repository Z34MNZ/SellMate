import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsCCoezl44_IkZbW8zXxPF-lDaIUY2jqE",
  authDomain: "sellmate-ac172.firebaseapp.com",
  projectId: "sellmate-ac172",
  storageBucket: "sellmate-ac172.firebasestorage.app",
  messagingSenderId: "846268779170",
  appId: "1:846268779170:web:7c24d21758890c8e6465fb",
  measurementId: "G-LS80CJ6RJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app; 