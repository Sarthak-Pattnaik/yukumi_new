import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC8Trj0G9sfHKSK7wTolWvGKdQuH7oZ-Tg",
    authDomain: "yukumi.firebaseapp.com",
    projectId: "yukumi",
    storageBucket: "yukumi.firebasestorage.app",
    messagingSenderId: "325910237158",
    appId: "1:325910237158:web:231a6ffa191417574a9027",
    measurementId: "G-E3DD2214RH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, googleProvider, facebookProvider, signInWithPopup, signOut };
