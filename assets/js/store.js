// store.js - product access and cart storage with Firebase
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const STORE = (function(){
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
  const db = getFirestore(app);

  const fmt = won => `₩${won.toLocaleString('ko-KR')}`;
  let currentCart = [];
  let isLoading = false;
  let userReady = false;
  let currentUser = null;

  // Wait for authentication to be ready
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
      console.log("User authenticated:", user.email);
      userReady = true;
      await initializeUserAndCart();
    } else {
      console.log("User not authenticated");
      userReady = false;
      currentCart = [];
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  });

  // Initialize user document and load cart
  async function initializeUserAndCart() {
    if (!currentUser || !db) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) { 
        // Create new user document
        await setDoc(userRef, {
          email: currentUser.email,
          bought: [],
          shoppingCart: [],
          priceOfSC: 0
        });
        currentCart = [];
        console.log("New user document created");
      } else {
        // Load existing cart
        const data = docSnap.data();
        currentCart = data.shoppingCart || [];
        console.log("Loaded existing cart:", currentCart.length, "items");
      }
      
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error("Error initializing user:", error);
    }
  }

  // Get current user's cart from Firebase
  async function getCart(){ 
    if (!userReady || !currentUser) {
      return [];
    }
    
    if (isLoading) return [...currentCart];
    
    try {
      isLoading = true;
      const userRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        currentCart = data.shoppingCart || [];
      } else {
        currentCart = [];
      }
      
      isLoading = false;
      return [...currentCart];
    } catch (error) {
      console.error("Error getting cart:", error);
      isLoading = false;
      return [...currentCart];
    }
  }

  // Save cart to Firebase
  async function setCart(cart){
    if (!currentUser || !userReady || !db) {
      console.warn("Cannot save cart - user not ready");
      return;
    }
    
    try {
      currentCart = [...cart];
      const cartTotal = cart.reduce((a,i) => a + i.price * i.qty, 0);
      const userRef = doc(db, 'users', currentUser.uid);
      
      await updateDoc(userRef, {
        shoppingCart: cart,
        priceOfSC: cartTotal
      });
      
      console.log("Cart saved successfully");
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error("Error saving cart:", error);
      // If update fails, try to set the entire document
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const cartTotal = cart.reduce((a,i) => a + i.price * i.qty, 0);
        await setDoc(userRef, {
          email: currentUser.email,
          bought: [],
          shoppingCart: cart,
          priceOfSC: cartTotal
        }, { merge: true });
        
        console.log("Cart saved with merge");
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (setError) {
        console.error("Error creating user document:", setError);
      }
    }
  }

  async function addToCart(product, size, qty){
    console.log("Adding to cart:", product.name, size, qty);
    
    if (!userReady || !currentUser) {
      console.error("User not authenticated for cart operations");
      alert("Please log in to add items to cart");
      return;
    }

    const key = product.id + ':' + size;
    const cart = await getCart();
    const left = (product.stock?.[size] ?? Infinity);
    const found = cart.find(i=>i.key===key);
    
    if (left <= 0) {
      alert("This item is out of stock");
      return;
    }
    
    if(found){ 
      const newQty = Math.min(found.qty + qty, left);
      if (newQty > found.qty) {
        found.qty = newQty;
      } else {
        alert("Cannot add more - stock limit reached");
        return;
      }
    } else {
      cart.push({ 
        key, 
        id: product.id, 
        name: product.name, 
        size, 
        price: product.price, 
        qty: Math.min(qty, left), 
        img: product.img 
      });
    }
    
    await setCart(cart);
    console.log("Cart updated successfully");
  }

  async function updateQty(key, qty){
    if (!userReady || !currentUser) {
      console.error("User not authenticated");
      return;
    }

    const cart = await getCart();
    const item = cart.find(i=>i.key===key);
    if(!item) return;
    
    // Get product to check stock
    const product = PRODUCTS.find(p => p.id === item.id);
    const maxQty = product?.stock?.[item.size] || 1;
    
    item.qty = Math.min(Math.max(1, qty|0), maxQty);
    await setCart(cart);
  }

  async function removeItem(key){
    if (!userReady || !currentUser) {
      console.error("User not authenticated");
      return;
    }

    const cart = await getCart();
    const filteredCart = cart.filter(i=>i.key!==key);
    await setCart(filteredCart);
  }

  async function empty(){ 
    if (!userReady || !currentUser) {
      console.error("User not authenticated");
      return;
    }
    await setCart([]); 
  }

  function total(){ 
    return currentCart.reduce((a,i)=>a+i.price*i.qty,0); 
  }

  // Move cart items to bought and empty cart
  async function checkout(customerInfo) {
    if (!currentUser || !userReady) {
      console.error("User not authenticated for checkout");
      return false;
    }
    
    try {
      const cart = await getCart();
      if (cart.length === 0) {
        alert("Your cart is empty");
        return false;
      }
      
      const userRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(userRef);
      
      const currentBought = docSnap.exists() ? (docSnap.data().bought || []) : [];
      
      // Add cart items to bought array with customer info and timestamp
      const orderTotal = total();
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newPurchases = cart.map(item => ({
        ...item,
        orderId: orderId,
        customerName: customerInfo.name,
        customerGrade: customerInfo.grade,
        customerEmail: currentUser.email,
        purchasedAt: new Date().toISOString(),
        orderTotal: orderTotal
      }));
      
      const allBought = [...currentBought, ...newPurchases];
      
      // Update Firebase: empty cart and update bought items
      await updateDoc(userRef, {
        shoppingCart: [],
        priceOfSC: 0,
        bought: allBought
      });
      
      currentCart = [];
      
      // TODO: Google Sheets integration will go here
      // Send order data to Google Sheets with customerInfo and cart details
      console.log("Order placed:", { 
        orderId, 
        customerInfo, 
        cart: newPurchases, 
        orderTotal,
        userEmail: currentUser.email 
      });
      
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      return { orderId, items: newPurchases, total: orderTotal };
    } catch (error) {
      console.error("Error during checkout:", error);
      return false;
    }
  }

  function getProductById(id){ 
    return PRODUCTS.find(p=>p.id===id); 
  }

  // Public interface
  return { 
    fmt, 
    getCart, 
    setCart, 
    addToCart, 
    updateQty, 
    removeItem, 
    empty, 
    total, 
    checkout,
    getProductById,
    get ready() { return userReady; },
    get user() { return currentUser; }
  };
})();

// Make STORE globally available
window.STORE = STORE;