// authCheck.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCo_9U-Ged9xcsMwnRlNNoSJc6mV84KyaY",
    authDomain: "kkfs-merch-55e11.firebaseapp.com",
    projectId: "kkfs-merch-55e11",
    storageBucket: "kkfs-merch-55e11.firebasestorage.app",
    messagingSenderId: "324569689619",
    appId: "1:324569689619:web:1e0763d6a05010610559e6",
    measurementId: "G-63HP6N5Q9L"
  };

// Initialize Firebase (or use existing app)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
/*
// Redirect to login if user is not logged in
onAuthStateChanged(auth, (user) => {
  if (!user && window.location.pathname !== '/login.html') {
    window.location.href = "login.html";
  }

});



