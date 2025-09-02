import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDPrE0pFoclbxzAMeRZkha8AEm-TWv8BQ",
  authDomain: "kkfs-merch.firebaseapp.com",
  projectId: "kkfs-merch",
  storageBucket: "kkfs-merch.firebasestorage.app",
  messagingSenderId: "39903297001",
  appId: "1:39903297001:web:45449b15644c272c661f78",
  measurementId: "G-8XEY41KLSP"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const analytics = getAnalytics(app);

onAuthStateChanged(auth, (user) => {
  const loginPage = document.getElementById("LoginPage");
  if (user) {
    window.location.href = "index.html"; // already logged in
  } else {
    loginPage.style.display = "block"; // show login page
  }
});
