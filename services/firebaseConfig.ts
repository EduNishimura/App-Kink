// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAu-iypqoVbFrxjwst1O0D7_83PB7YYrPQ",
    authDomain: "kink-app-7e846.firebaseapp.com",
    projectId: "kink-app-7e846",
    storageBucket: "kink-app-7e846.firebasestorage.app",
    messagingSenderId: "1026433181547",
    appId: "1:1026433181547:web:429155902eeaaa378e0e2e",
    measurementId: "G-3VLTSJV9CK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics conditionally
let analytics;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

export { analytics, app, auth, db };

