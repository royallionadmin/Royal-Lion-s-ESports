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
const searchInput = document.getElementById("searchInput");

let allMembers = [];

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href="index.html";

        return;

    }

    try{

        const adminRef = doc(db,"users",user.uid);

        const adminSnap = await getDoc(adminRef);

        if(!adminSnap.exists() || adminSnap.data().role !== "admin"){

            alert("Admins only.");

            location.href="dashboard.html";

            return;

        }

        loadMembers();

    }

    catch(error){

        console.error(error);

        alert("Failed to verify admin.");

        location.href="dashboard.html";

    }

});

async function loadMembers(){

    container.innerHTML = `
<div class="empty">
Loading members...
</div>
`;

    const q = query(

        collection(db,"users"),

        where("status","==","Active")

    );

    const snapshot = await getDocs(q);

    allMembers = [];

    snapshot.forEach(member=>{

        allMembers.push({

            id:member.id,

            ...member.data()

        });

    });
        allMembers.sort((a,b)=>{

        const teamA = (a.team || "").trim();

        const teamB = (b.team || "").trim();

        if(teamA === "" && teamB !== "") return -1;

        if(teamA !== "" && teamB === "") return 1;

        if(teamA.toLowerCase() !== teamB.toLowerCase()){

            return teamA.localeCompare(teamB);

        }

        return (a.name || "").localeCompare(b.name || "");

    });

    renderMembers(allMembers);

}

function renderMembers(list){

    container.innerHTML = "";

    if(list.length === 0){

        container.innerHTML = `
<div class="empty">
No active members found.
</div>
`;

        return;

    }

    list.forEach(member=>{

        const card = document.createElement("div");

        card.className = "member";

        card.innerHTML = `

<h3>${member.name || "-"}</h3>

<small>

📧 ${member.email || "-"}

</small>

<label>Team</label>

<input
class="team"
value="${member.team || ""}"
placeholder="Enter team name">

<label>Guild Rank</label>

<select class="guildRank">
<option value="Leader" ${member.guildRank=="Leader"?"selected":""}>
👑 Leader
</option>

<option value="Co-Leader" ${member.guildRank=="Co-Leader"?"selected":""}>
🛡️ Co-Leader
</option>

<option value="Elite" ${member.guildRank=="Elite"?"selected":""}>
⭐ Elite
</option>

<option value="Veteran" ${member.guildRank=="Veteran"?"selected":""}>
🎖️ Veteran
</option>

<option value="Core Member" ${member.guildRank=="Core Member"?"selected":""}>
⚔️ Core Member
</option>

<option value="Member" ${member.guildRank=="Member"?"selected":""}>
👤 Member
</option>

<option value="Recruit" ${member.guildRank=="Recruit"?"selected":""}>
🌱 Recruit
</option>

</select>

<label>Glory</label>

<input
class="glory"
type="number"
value="${member.glory ?? 0}">

<label>Guild War Points</label>

<input
class="points"
type="number"
value="${member.guildWarPoints ?? 0}">

<label>Status</label>

<select class="status">

<option value="Active" ${member.status=="Active"?"selected":""}>
Active
</option>

<option value="Pending" ${member.status=="Pending"?"selected":""}>
Pending
</option>

<option value="Suspended" ${member.status=="Suspended"?"selected":""}>
Suspended
</option>

</select>

<button
class="save">

💾 Save Changes

</button>

`;
        const saveBtn = card.querySelector(".save");

        saveBtn.onclick = async()=>{

            saveBtn.disabled = true;

            saveBtn.textContent = "Saving...";

            try{

                await updateDoc(

                    doc(db,"users",member.id),

                    {

                        team: card.querySelector(".team").value.trim(),

                        guildRank: card.querySelector(".guildRank").value,

                        glory: Number(

                            card.querySelector(".glory").value

                        ),

                        guildWarPoints: Number(

                            card.querySelector(".points").value

                        ),

                        status: card.querySelector(".status").value

                    }

                );

                saveBtn.textContent = "✅ Saved";

            }

            catch(error){

                console.error(error);

                saveBtn.textContent = "❌ Failed";

            }

            setTimeout(()=>{

                saveBtn.disabled = false;

                saveBtn.textContent = "💾 Save Changes";

            },1500);

        };

        container.appendChild(card);

    });

}

searchInput.addEventListener("input",()=>{

    const text = searchInput.value
        .toLowerCase()
        .trim();

    const filtered = allMembers.filter(member=>

        (member.name || "")
        .toLowerCase()
        .includes(text)

        ||

        (member.email || "")
        .toLowerCase()
        .includes(text)

        ||

        (member.uid || "")
        .toLowerCase()
        .includes(text)

        ||

        (member.team || "")
        .toLowerCase()
        .includes(text)

    );

    renderMembers(filtered);

});