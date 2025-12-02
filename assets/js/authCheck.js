// authCheck.js
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCo_9U-Ged9xcsMwnRlNNoSJc6mV84KyaY",
    authDomain: "kkfs-merch-55e11.firebaseapp.com",
    projectId: "kkfs-merch-55e11",
    storageBucket: "kkfs-merch-55e11.firebasestorage.app",
    messagingSenderId: "324569689619",
    appId: "1:324569689619:web:1e0763d6a05010610559e6",
    measurementId: "G-63HP6N5Q9L"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔥 NO REDIRECTS
// 🔥 NO LOGIN ENFORCEMENT
