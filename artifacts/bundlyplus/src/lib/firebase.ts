import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHJ26RcryZH6FVtp-hHcOVsFJEEwd1X9M",
  authDomain: "bundlyplus.firebaseapp.com",
  projectId: "bundlyplus",
  storageBucket: "bundlyplus.firebasestorage.app",
  messagingSenderId: "268496974995",
  appId: "1:268496974995:web:d005ccaac22ca906c44966",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
