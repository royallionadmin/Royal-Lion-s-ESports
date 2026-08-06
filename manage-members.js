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

        loadMembers();

    } catch (error) {

        console.error(error);
        alert("Failed to verify admin.");
        location.href = "dashboard.html";

    }

});

async function loadMembers() {

    container.innerHTML = "";

    const q = query(
        collection(db, "users"),
        where("status", "==", "Active")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        container.innerHTML = `
            <div class="empty">
                No active members found.
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

            <label>Team</label>
            <input class="team" value="${data.team || ""}">

            <label>Guild Rank</label>
            <select class="guildRank">

                <option value="Leader" ${data.guildRank=="Leader"?"selected":""}>👑 Leader</option>

                <option value="Co-Leader" ${data.guildRank=="Co-Leader"?"selected":""}>🛡️ Co-Leader</option>

                <option value="Elite" ${data.guildRank=="Elite"?"selected":""}>⭐ Elite</option>

                <option value="Veteran" ${data.guildRank=="Veteran"?"selected":""}>🎖️ Veteran</option>

                <option value="Core Member" ${data.guildRank=="Core Member"?"selected":""}>⚔️ Core Member</option>

                <option value="Member" ${data.guildRank=="Member"?"selected":""}>👤 Member</option>

                <option value="Recruit" ${data.guildRank=="Recruit"?"selected":""}>🌱 Recruit</option>

            </select>

            <label>Glory</label>
            <input class="glory" type="number" value="${data.glory ?? 0}">

            <label>Guild War Points</label>
            <input class="points" type="number" value="${data.guildWarPoints ?? 0}">

            <label>Status</label>

            <select class="status">

                <option value="Active" ${data.status=="Active"?"selected":""}>Active</option>

                <option value="Pending" ${data.status=="Pending"?"selected":""}>Pending</option>

                <option value="Suspended" ${data.status=="Suspended"?"selected":""}>Suspended</option>

            </select>

            <button class="save">
                💾 Save Changes
            </button>

        `;

        const saveBtn = card.querySelector(".save");

        saveBtn.onclick = async () => {

            saveBtn.disabled = true;
            saveBtn.textContent = "Saving...";

            try {

                await updateDoc(doc(db, "users", member.id), {

                    team: card.querySelector(".team").value.trim(),

                    guildRank: card.querySelector(".guildRank").value,

                    glory: Number(card.querySelector(".glory").value),

                    guildWarPoints: Number(card.querySelector(".points").value),

                    status: card.querySelector(".status").value

                });

                saveBtn.textContent = "✅ Saved";

            } catch (error) {

                console.error(error);

                saveBtn.textContent = "❌ Failed";

            }

            setTimeout(() => {

                saveBtn.disabled = false;
                saveBtn.textContent = "💾 Save Changes";

            }, 1500);

        };

        container.appendChild(card);

    });

}