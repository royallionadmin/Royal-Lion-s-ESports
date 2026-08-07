import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

loadPopup();

async function loadPopup(){

    try{

        const q = query(
            collection(db,"notices"),
            where("popup","==",true)
        );

        const snapshot = await getDocs(q);

        if(snapshot.empty){
            return;
        }

        let notices = [];

        snapshot.forEach(doc=>{

            notices.push({
                id:doc.id,
                ...doc.data()
            });

        });

        notices.sort((a,b)=>{

            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;

            return timeB - timeA;

        });

        const notice = notices[0];

        const lastSeen = localStorage.getItem("lastSeenPopup");

        if(lastSeen === notice.id){
            return;
        }

        showPopup(notice);

    }

    catch(error){

        console.error(error);

    }

}

function showPopup(notice){

    const overlay = document.createElement("div");

    overlay.id = "popupOverlay";

    overlay.innerHTML = `
<div id="popupBox">

<h2>📢 ${notice.title}</h2>

<div id="popupType">${getTypeEmoji(notice.type)} ${notice.type}</div>

<div id="popupMessage">${notice.message}</div>

<button id="closePopup">Close</button>

</div>
`;

    document.body.appendChild(overlay);

    const style = document.createElement("style");

    style.textContent = `#popupOverlay{

position:fixed;

top:0;

left:0;

width:100%;

height:100%;

background:rgba(0,0,0,.75);

display:flex;

justify-content:center;

align-items:center;

padding:20px;

z-index:9999;

}

#popupBox{

width:100%;

max-width:400px;

background:#1b1b1b;

border:2px solid #ff2d2d;

border-radius:20px;

padding:22px;

box-shadow:0 0 20px rgba(255,0,0,.35);

animation:popup .25s ease;

}

@keyframes popup{

from{

opacity:0;

transform:scale(.9);

}

to{

opacity:1;

transform:scale(1);

}

}

#popupBox h2{

margin:0;

margin-bottom:12px;

text-align:center;

font-size:28px;

color:#ff2d2d;

text-shadow:0 0 10px red;

}

#popupType{

display:inline-block;

margin:0 auto 18px;

padding:7px 15px;

border-radius:20px;

background:#7b1fa2;

color:#fff;

font-size:14px;

font-weight:bold;

text-align:center;

display:block;

width:max-content;

}

#popupMessage{

width:100%;

margin:0 0 22px 0;

padding:0;

text-align:left;

white-space:pre-wrap;

line-height:1.7;

color:#e5e5e5;

font-size:16px;

word-break:break-word;

}

#closePopup{

width:100%;

padding:15px;

border:none;

border-radius:10px;

background:#ff0000;

color:white;

font-size:16px;

font-weight:bold;

cursor:pointer;

transition:.25s;

}

#closePopup:hover{

background:#c40000;

}

@media(max-width:500px){

#popupBox{

padding:18px;

}

#popupBox h2{

font-size:24px;

}

#popupMessage{

font-size:15px;

}

}

`;


    document.head.appendChild(style);

    document
        .getElementById("closePopup")
        .addEventListener("click", () => {

            localStorage.setItem(
                "lastSeenPopup",
                notice.id
            );

            overlay.remove();
            style.remove();

        });

}

function getTypeEmoji(type){

    switch(type){

        case "Tournament":
            return "🏆";

        case "Event":
            return "🎉";

        case "Maintenance":
            return "⚠️";

        case "Emergency":
            return "🚨";

        default:
            return "📢";

    }

}