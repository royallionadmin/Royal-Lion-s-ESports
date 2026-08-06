import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Elements
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn");

// Menu
menuBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sideMenu.classList.remove("active");
  overlay.classList.remove("active");
});

document.querySelectorAll(".side-menu a").forEach(link => {
  link.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});

// Protect Dashboard
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
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
