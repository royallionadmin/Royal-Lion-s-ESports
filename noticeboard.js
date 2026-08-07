import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const noticeList = document.getElementById("noticeList");
const searchInput = document.getElementById("searchInput");

let allNotices = [];

loadNotices();

async function loadNotices(){

    noticeList.innerHTML = `<div class="empty">Loading notices...</div>`;

    try{

        const snapshot = await getDocs(

            collection(db,"notices")

        );

        allNotices = [];

        snapshot.forEach(docSnap=>{

            allNotices.push({

                id:docSnap.id,

                ...docSnap.data()

            });

        });

        allNotices.sort((a,b)=>{

            if((a.pinned||false)!==(b.pinned||false)){

                return (b.pinned||false)-(a.pinned||false);

            }

            const dateA = a.createdAt?.seconds || 0;

            const dateB = b.createdAt?.seconds || 0;

            return dateB-dateA;

        });

        renderNotices(allNotices);

    }

    catch(error){

        console.error(error);

        noticeList.innerHTML = `<div class="empty">Failed to load notices.</div>`;

    }

}
function renderNotices(list){

    noticeList.innerHTML = "";

    if(list.length===0){

        noticeList.innerHTML = `<div class="empty">No notices available.</div>`;

        return;

    }

    list.forEach(notice=>{

        const date = notice.createdAt

            ? notice.createdAt.toDate().toLocaleDateString()

            : "-";

        noticeList.innerHTML += `
<div class="notice">

<div class="notice-header">

<div class="type ${getTypeClass(notice.type)}">${getTypeEmoji(notice.type)} ${notice.type || "Announcement"}</div>

${notice.pinned ? '<div class="pin">📌 Pinned</div>' : ''}

</div>

<div class="title">${notice.title || "Untitled"}</div>

<div class="message">${notice.message || ""}</div>

<div class="footer">

<div>📅 ${date}</div>

<div>${notice.createdBy || "Admin"}</div>

</div>

</div>`;
    });

}searchInput.addEventListener("input",()=>{

    const text = searchInput.value

        .toLowerCase()

        .trim();

    const filtered = allNotices.filter(notice=>

        (notice.title || "")

            .toLowerCase()

            .includes(text)

        ||

        (notice.message || "")

            .toLowerCase()

            .includes(text)

        ||

        (notice.type || "")

            .toLowerCase()

            .includes(text)

    );

    renderNotices(filtered);

});

function getTypeClass(type){

    switch(type){

        case "Tournament":

            return "tournament";

        case "Event":

            return "event";

        case "Maintenance":

            return "maintenance";

        case "Emergency":

            return "emergency";

        default:

            return "announcement";

    }

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