import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
  
  const emailValue = email.value.trim();
  const passwordValue = password.value;
  
  if (!emailValue || !passwordValue) {
    message.textContent = "Please enter your email and password.";
    return;
  }
  
  try {
    
    await signInWithEmailAndPassword(
      auth,
      emailValue,
      passwordValue
    );
    
    location.href = "dashboard.html";
    
  } catch (error) {
    
    switch (error.code) {
      
      case "auth/invalid-credential":
        message.textContent = "Invalid email or password.";
        break;
        
      case "auth/invalid-email":
        message.textContent = "Invalid email address.";
        break;
        
      case "auth/too-many-requests":
        message.textContent = "Too many attempts. Try again later.";
        break;
        
      default:
        message.textContent = error.message;
        
    }
    
  }
  
});
