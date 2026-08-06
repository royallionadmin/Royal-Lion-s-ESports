import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const fullName = document.getElementById("fullName");
const ign = document.getElementById("ign");
const ffUid = document.getElementById("ffUid");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const facebook = document.getElementById("facebook");
const team = document.getElementById("team");
const glory = document.getElementById("glory");
const guildWarPoints = document.getElementById("guildWarPoints");
const joinDate = document.getElementById("joinDate");
const status = document.getElementById("status");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "index.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

            fullName.textContent = "-";
            ign.textContent = "-";
            ffUid.textContent = "-";
            phone.textContent = "-";
            email.textContent = user.email;
            facebook.textContent = "-";
            team.textContent = "Unassigned";
            glory.textContent = "0";
            guildWarPoints.textContent = "0";
            joinDate.textContent = "-";
            status.textContent = "Active";

            return;
        }

        const data = userSnap.data();

        fullName.textContent = data.fullName || data.name || "-";
        ign.textContent = data.ign || "-";
        ffUid.textContent = data.ffUid || "-";
        phone.textContent = data.phone || "-";
        email.textContent = data.email || user.email;
        facebook.textContent = data.facebook || "-";
        team.textContent = data.team || "Unassigned";
        glory.textContent = data.glory ?? 0;
        guildWarPoints.textContent = data.guildWarPoints ?? 0;
        status.textContent = data.status || "Active";

        if (data.joinDate) {
            joinDate.textContent = data.joinDate.toDate().toLocaleDateString();
        } else if (data.createdAt) {
            joinDate.textContent = data.createdAt.toDate().toLocaleDateString();
        } else {
            joinDate.textContent = "-";
        }

    } catch (error) {

        console.error(error);
        alert("Failed to load profile.");

    }

});
