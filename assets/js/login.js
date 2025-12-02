import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCo_9U-Ged9xcsMwnRlNNoSJc6mV84KyaY",
    authDomain: "kkfs-merch-55e11.firebaseapp.com",
    projectId: "kkfs-merch-55e11",
    storageBucket: "kkfs-merch-55e11.firebasestorage.app",
    messagingSenderId: "324569689619",
    appId: "1:324569689619:web:1e0763d6a05010610559e6",
    measurementId: "G-63HP6N5Q9L"
  };

// Use the same app if already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);

/*const db = getFirestore(app);
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




