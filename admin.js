import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "index.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("Access denied.");
            location.href = "dashboard.html";
            return;
        }

        const data = userSnap.data();

        if (data.role !== "admin") {
            alert("Admins only.");
            location.href = "dashboard.html";
            return;
        }

    } catch (error) {

        console.error(error);
        alert("Failed to verify admin access.");
        location.href = "dashboard.html";

    }

});