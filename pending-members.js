import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const container = document.getElementById("membersContainer");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "index.html";
        return;
    }

    try {

        const adminRef = doc(db, "users", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists() || adminSnap.data().role !== "admin") {
            alert("Admins only.");
            location.href = "dashboard.html";
            return;
        }

        loadPendingMembers();

    } catch (error) {

        console.error(error);
        alert("Failed to load page.");

    }

});

async function loadPendingMembers() {

    container.innerHTML = "";

    const q = query(
        collection(db, "users"),
        where("status", "==", "Pending")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        container.innerHTML = `
        <div class="empty">
            No pending members.
        </div>
        `;

        return;
    }

    snapshot.forEach((member) => {

        const data = member.data();

        const card = document.createElement("div");
        card.className = "member";

        card.innerHTML = `
            <h3>${data.name || "-"}</h3>

            <p><b>Email:</b> ${data.email}</p>

            <p><b>IGN:</b> ${data.ign || "-"}</p>

            <div class="buttons">

                <button class="approve">
                    ✅ Approve
                </button>

            </div>
        `;

        card.querySelector(".approve").onclick = async () => {

            await updateDoc(doc(db, "users", member.id), {

                status: "Active"

            });

            loadPendingMembers();

        };

        container.appendChild(card);

    });

}