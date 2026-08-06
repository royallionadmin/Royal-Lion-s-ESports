import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const fullName = document.getElementById("fullName");
const ign = document.getElementById("ign");
const ffUid = document.getElementById("ffUid");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const facebook = document.getElementById("facebook");

const saveBtn = document.getElementById("saveBtn");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "index.html";
        return;
    }

    currentUser = user;
    email.value = user.email;

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const data = userSnap.data();

            fullName.value = data.fullName || "";
            ign.value = data.ign || "";
            ffUid.value = data.ffUid || "";
            phone.value = data.phone || "";
            facebook.value = data.facebook || "";

        }

    } catch (error) {

        console.error(error);
        alert("Failed to load profile.");

    }

});

saveBtn.addEventListener("click", async () => {

    if (!currentUser) return;

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {

        const userRef = doc(db, "users", currentUser.uid);

        await updateDoc(userRef, {

            fullName: fullName.value.trim(),
            ign: ign.value.trim(),
            ffUid: ffUid.value.trim(),
            phone: phone.value.trim(),
            facebook: facebook.value.trim()

        });

        alert("Profile updated successfully!");

        location.href = "profile.html";

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

    saveBtn.disabled = false;
    saveBtn.textContent = "💾 Save Changes";

});