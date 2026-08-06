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

            return timeB-timeA;

        });

        const notice = notices[0];

        showPopup(notice);

    }

    catch(error){

        console.error(error);

    }

}

function showPopup(notice){

    const overlay = document.createElement("div");

    overlay.id="popupOverlay";

    overlay.innerHTML = `
    
         <div id="popupBox">

            <h2>

                📢 ${notice.title}

            </h2>

            <div id="popupType">

                ${getTypeEmoji(notice.type)}
                ${notice.type}

            </div>

            <p>

                ${notice.message}

            </p>

            <button id="closePopup">

                Close

            </button>

        </div>

    `;

    document.body.appendChild(overlay);

    const style = document.createElement("style");

    style.textContent = `

    #popupOverlay{

        position:fixed;

        top:0;

        left:0;

        width:100%;

        height:100%;

        background:rgba(0,0,0,.75);

        display:flex;

        justify-content:center;

        align-items:center;

        z-index:9999;

        padding:20px;

    }

    #popupBox{

        background:#1b1b1b;

        border:2px solid #ff0000;

        border-radius:20px;

        max-width:450px;

        width:100%;

        padding:25px;

        text-align:center;

        color:white;

        box-shadow:0 0 20px rgba(255,0,0,.4);

    }

    #popupBox h2{

        margin-bottom:15px;

        color:#ff2d2d;

    }

    #popupType{

        font-weight:bold;

        margin-bottom:15px;

    }

    #popupBox p{

        white-space:pre-wrap;

        line-height:1.7;

        margin-bottom:25px;

    }

    #closePopup{

        width:100%;

        padding:14px;

        border:none;

        border-radius:10px;

        background:#ff0000;

        color:white;

        font-size:16px;

        font-weight:bold;

        cursor:pointer;

    }

    #closePopup:hover{

        background:#c40000;

    }

    `;

    document.head.appendChild(style);

    document.getElementById("closePopup")

    .addEventListener("click",()=>{

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