import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// Elements
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn");
const adminLink = document.getElementById("adminLink");


// Open Menu
menuBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("active");
  overlay.classList.toggle("active");
});


// Close Menu
overlay.addEventListener("click", () => {
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
});


// Close menu after clicking link
document.querySelectorAll(".side-menu a").forEach(link => {
  link.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});


// Check Login + Admin Role
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "index.html";
    return;
  }


  try {

    // Check user data from Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);


    if (userSnap.exists()) {

      const userData = userSnap.data();

      // Show Admin Panel if role is admin
      if (userData.role === "admin") {
        adminLink.style.display = "block";
      }

    }

  } catch (error) {
    console.error("Admin check failed:", error);
  }

});


// Logout
logoutBtn.addEventListener("click", async (e) => {

  e.preventDefault();

  try {

    await signOut(auth);
    location.href = "index.html";

  } catch (error) {

    alert(error.message);

  }

});