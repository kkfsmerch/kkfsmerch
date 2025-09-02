import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDPrE0pFoclbxzAMeRZkha8AEm-TWv8BQ",
  authDomain: "kkfs-merch.firebaseapp.com",
  projectId: "kkfs-merch",
  storageBucket: "kkfs-merch.firebasestorage.app",
  messagingSenderId: "39903297001",
  appId: "1:39903297001:web:45449b15644c272c661f78",
  measurementId: "G-8XEY41KLSP"
};

// Use the same app if already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("googleLoginBtn");

googleLogin.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        bought: [],
        shoppingCart: [],
        priceOfSC: 0
      });
    }

    // Redirect to main page
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login error:", error);
  }
});
