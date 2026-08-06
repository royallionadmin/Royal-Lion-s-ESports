import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const message = document.getElementById("message");

signupBtn.addEventListener("click", async () => {

const fullName = name.value.trim();
const emailValue = email.value.trim();
const passwordValue = password.value;

if (!fullName || !emailValue || !passwordValue) {
message.textContent = "Please fill in all fields.";
return;
}

try {

const userCredential = await createUserWithEmailAndPassword(
auth,
emailValue,
passwordValue
);

await setDoc(doc(db, "users", userCredential.user.uid), {

name: fullName,
email: emailValue,

role: "member",

status: "Pending",

guildRank: "Recruit",

team: "",

glory: 0,

guildWarPoints: 0,

ign: "",
ffUid: "",
phone: "",
facebook: "",

createdAt: serverTimestamp()

});

location.href = "dashboard.html";

} catch (error) {

switch (error.code) {

case "auth/email-already-in-use":
message.textContent = "Email is already registered.";
break;

case "auth/invalid-email":
message.textContent = "Invalid email address.";
break;

case "auth/weak-password":
message.textContent = "Password should be at least 6 characters.";
break;

default:
message.textContent = error.message;

}

}

});
