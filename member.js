import { db } from "./firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");

const body = document.body;
const header = document.getElementById("profileHeader");

const rankTitle = document.getElementById("rankTitle");

const name = document.getElementById("name");
const ign = document.getElementById("ign");
const ffUid = document.getElementById("ffUid");
const team = document.getElementById("team");
const glory = document.getElementById("glory");
const guildWarPoints = document.getElementById("guildWarPoints");
const facebook = document.getElementById("facebook");
const status = document.getElementById("status");
const joinDate = document.getElementById("joinDate");

loadMember();

async function loadMember(){

    if(!memberId){

        alert("Member not found.");

        location.href="guild-members.html";

        return;

    }

    try{

        const memberRef=doc(db,"users",memberId);

        const memberSnap=await getDoc(memberRef);

        if(!memberSnap.exists()){

            alert("Member not found.");

            location.href="guild-members.html";

            return;

        }

        const data=memberSnap.data();

        applyTheme(data.guildRank);

        rankTitle.textContent=
        `${getRankEmoji(data.guildRank)} ${data.guildRank || "Recruit"}`;

        name.textContent=data.name || "-";

        ign.textContent=data.ign || "-";

        ffUid.textContent=data.ffUid || "-";

        team.textContent=data.team || "Unassigned";

        glory.textContent=data.glory ?? 0;

        guildWarPoints.textContent=data.guildWarPoints ?? 0;

        facebook.textContent=data.facebook || "-";

        status.textContent=data.status || "-";

        if(data.createdAt){

            joinDate.textContent=
            data.createdAt.toDate().toLocaleDateString();

        }else{

            joinDate.textContent="-";

        }

    }

    catch(error){

        console.error(error);

        alert("Failed to load member.");

    }

}

function applyTheme(rank){

    body.className="";

    switch(rank){

        case "Leader":

            body.classList.add("leader");

            header.textContent="👑 Leader Profile";

            break;

        case "Co-Leader":

            body.classList.add("coleader");

            header.textContent="🛡️ Co-Leader Profile";

            break;

        case "Elite":

            body.classList.add("elite");

            header.textContent="⭐ Elite Profile";

            break;

        case "Veteran":

            body.classList.add("veteran");

            header.textContent="🎖️ Veteran Profile";

            break;

        case "Core Member":

            body.classList.add("core");

            header.textContent="⚔️ Core Member Profile";

            break;

        case "Member":

            body.classList.add("member");

            header.textContent="👤 Member Profile";

            break;

        default:

            body.classList.add("recruit");

            header.textContent="🌱 Recruit Profile";

    }

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

        default:
            return "🌱";

    }

}