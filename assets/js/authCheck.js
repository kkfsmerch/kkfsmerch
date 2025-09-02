// authCheck.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDPrE0pFoclbxzAMeRZkha8AEm-TWv8BQ",
  authDomain: "kkfs-merch.firebaseapp.com",
  projectId: "kkfs-merch",
  storageBucket: "kkfs-merch.firebasestorage.app",
  messagingSenderId: "39903297001",
  appId: "1:39903297001:web:45449b15644c272c661f78",
  measurementId: "G-8XEY41KLSP"
};

// Initialize Firebase (or use existing app)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Redirect to login if user is not logged in
onAuthStateChanged(auth, (user) => {
  if (!user && window.location.pathname !== '/login.html') {
    window.location.href = "login.html";
  }
});