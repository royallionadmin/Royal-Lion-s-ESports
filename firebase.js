import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJ25uGomKogXkY3LJsgLcqoaGC0oJdD7c",
  authDomain: "royal-lion-s-esports.firebaseapp.com",
  projectId: "royal-lion-s-esports",
  storageBucket: "royal-lion-s-esports.firebasestorage.app",
  messagingSenderId: "551239699101",
  appId: "1:551239699101:web:5fcd4f056d102a25c9a274"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
