// firebase-config.js
// -------------- IMPORTANT --------------
// Replace the values below with your Firebase project's config
// from Firebase Console -> Project settings -> Add Web App
// Also ensure you enabled Authentication (Google & Phone), Firestore and Storage.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Load Firebase SDK (compat for simplicity)
(function loadFirebase() {
  const f1 = document.createElement('script');
  f1.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js";
  f1.onload = () => {
    const f2 = document.createElement('script');
    f2.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js";
    f2.onload = () => {
      const f3 = document.createElement('script');
      f3.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js";
      f3.onload = () => {
        const f4 = document.createElement('script');
        f4.src = "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js";
        f4.onload = initFirebase;
        document.head.appendChild(f4);
      };
      document.head.appendChild(f3);
    };
    document.head.appendChild(f2);
  };
  document.head.appendChild(f1);

  function initFirebase() {
    firebase.initializeApp(firebaseConfig);
    window.fbAuth = firebase.auth();
    window.fbDB = firebase.firestore();
    window.fbStorage = firebase.storage();
    console.log("Firebase initialized (firebase-config.js).");
  }
})();
