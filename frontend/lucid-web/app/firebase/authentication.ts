// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqI-Mr1VDEEjY5DVQLK1snzNbXDMaSUxI",
  authDomain: "lucid-web-c1e92.firebaseapp.com",
  projectId: "lucid-web-c1e92",
  storageBucket: "lucid-web-c1e92.firebasestorage.app",
  messagingSenderId: "457724525008",
  appId: "1:457724525008:web:0d1085b88314ec768f61d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});