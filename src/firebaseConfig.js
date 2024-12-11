// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAT1xi5DEb7loZLXXGUhAkz16sJqJNCcrk",
  authDomain: "shukri-dc819.firebaseapp.com",
  projectId: "shukri-dc819",
  storageBucket: "shukri-dc819.firebasestorage.app",
  messagingSenderId: "909858770408",
  appId: "1:909858770408:web:0aab860c7cd3a95c6c285d",
  measurementId: "G-BBVC7FMHWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export default db;