import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
getDoc,
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const teamContainer = document.getElementById("teamContainer");

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href = "index.html";

        return;

    }

    try{

        const userRef = doc(db,"users",user.uid);

        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()){

            location.href = "dashboard.html";

            return;

        }

        const myData = userSnap.data();

        const myTeam = (myData.team || "").trim();

        if(myTeam === ""){

            teamContainer.innerHTML = `
<div class="empty">

You haven't been assigned to a team yet.

</div>
`;

            return;

        }

        loadTeam(myTeam);

    }

    catch(error){

        console.error(error);

        teamContainer.innerHTML = `
<div class="empty">

Failed to load your team.

</div>
`;

    }

});

async function loadTeam(teamName){

    teamContainer.innerHTML = `
<div class="empty">

Loading team members...

</div>
`;

    try{

        const q = query(

            collection(db,"users"),

            where("team","==",teamName),

            where("status","==","Active")

        );

        const snapshot = await getDocs(q);

        let members = [];

        snapshot.forEach(docSnap=>{

            members.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });
                members.sort((a,b)=>{

            const order={

                "Leader":1,

                "Co-Leader":2,

                "Elite":3,

                "Veteran":4,

                "Core Member":5,

                "Member":6,

                "Recruit":7

            };

            return (order[a.guildRank] || 99) -

                   (order[b.guildRank] || 99);

        });

        const totalGlory = members.reduce(

            (sum,member)=>sum + (member.glory || 0),

            0

        );

        const totalGuildWar = members.reduce(

            (sum,member)=>sum + (member.guildWarPoints || 0),

            0

        );

        renderTeam(

            teamName,

            members,

            totalGlory,

            totalGuildWar

        );

    }

    catch(error){

        console.error(error);

        teamContainer.innerHTML = `
<div class="empty">

Failed to load team members.

</div>
`;

    }

}

function renderTeam(

    teamName,

    members,

    totalGlory,

    totalGuildWar

){

    teamContainer.innerHTML = `

<div class="teamCard">

<div class="teamName">

🏆 ${teamName}

</div>

<div class="teamCount">

👥 Members: ${members.length}

</div>

<div class="teamCount">

⭐ Total Glory: ${totalGlory}

</div>

<div class="teamCount">

⚔️ Total Guild War Points: ${totalGuildWar}

</div>

</div>

`;
    members.forEach(member=>{

        teamContainer.innerHTML += `

<div class="member">

<div class="memberName">

👤 ${member.name || "-"}

</div>

<div class="info">

${getRankEmoji(member.guildRank)}
${member.guildRank || "Member"}

</div>

<div class="info">

⭐ Glory: ${member.glory ?? 0}

</div>

<div class="info">

⚔️ Guild War Points: ${member.guildWarPoints ?? 0}

</div>

</div>

`;

    });

}

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

        case "Recruit":
            return "🌱";

        default:
            return "👤";

    }

}