import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const membersBody = document.getElementById("membersBody");
const searchInput = document.getElementById("searchInput");

let allMembers = [];

loadMembers();

async function loadMembers() {

    membersBody.innerHTML = `
        <tr>
            <td colspan="7" class="empty">
                Loading members...
            </td>
        </tr>
    `;

    try {

        const q = query(
            collection(db, "users"),
            where("status", "==", "Active")
        );

        const snapshot = await getDocs(q);

        allMembers = [];

        snapshot.forEach((docSnap) => {

            allMembers.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        // Sort members by Guild Rank first,
        // then by Glory (highest first)

        const rankOrder = {

            "Leader": 1,
            "Co-Leader": 2,
            "Elite": 3,
            "Veteran": 4,
            "Core Member": 5,
            "Member": 6,
            "Recruit": 7

        };

        allMembers.sort((a, b) => {

            const rankA = rankOrder[a.guildRank] || 99;
            const rankB = rankOrder[b.guildRank] || 99;

            if (rankA !== rankB) {

                return rankA - rankB;

            }

            return (b.glory ?? 0) - (a.glory ?? 0);

        });

        renderTable(allMembers);

    } catch (error) {

        console.error(error);

        membersBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    Failed to load members.
                </td>
            </tr>
        `;

    }

}

function renderTable(list) {

    membersBody.innerHTML = "";

    if (list.length === 0) {

        membersBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No members found.
                </td>
            </tr>
        `;

        return;

    }

    list.forEach(member => {

        membersBody.innerHTML += `

        <tr>

            <td>

                ${getRankEmoji(member.guildRank)}
                ${member.guildRank || "Recruit"}

            </td>

            <td>

                ${member.name || "-"}

            </td>

            <td>

                ${member.ign || "-"}

            </td>

            <td>

                ${member.team || "-"}

            </td>

            <td>

                ${member.glory ?? 0}

            </td>

            <td>

                ${member.guildWarPoints ?? 0}

            </td>

            <td>

                <button
                class="viewBtn"
                onclick="viewMember('${member.id}')">

                👁️

                </button>

            </td>

        </tr>

        `;

    });

}searchInput.addEventListener("input", () => {

    const text = searchInput.value
        .toLowerCase()
        .trim();

    const filtered = allMembers.filter(member =>

        (member.name || "")
            .toLowerCase()
            .includes(text)

        ||

        (member.ign || "")
            .toLowerCase()
            .includes(text)

        ||

        (member.team || "")
            .toLowerCase()
            .includes(text)

        ||

        (member.guildRank || "")
            .toLowerCase()
            .includes(text)

    );

    renderTable(filtered);

});

function getRankEmoji(rank){

    switch(rank){

        case "Leader":
            return "👑";

        case "Co-Leader":
            return "🛡️";

        case "Elite":
            return "⭐";

        case "Veteran":
            return "🎖️";

        case "Core Member":
            return "⚔️";

        case "Member":
            return "👤";

        default:
            return "🌱";

    }

}

window.viewMember = function(id){

    location.href = `member.html?id=${id}`;

};