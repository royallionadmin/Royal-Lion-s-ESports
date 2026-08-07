import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
collection,
doc,
getDoc,
getDocs,
addDoc,
updateDoc,
deleteDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const title = document.getElementById("title");
const type = document.getElementById("type");
const message = document.getElementById("message");

const pinned = document.getElementById("pinned");
const popup = document.getElementById("popup");

const publishBtn = document.getElementById("publishBtn");
const noticeList = document.getElementById("noticeList");

let editingId = null;
let currentAdmin = null;

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        location.href = "index.html";

        return;

    }

    const userRef = doc(db,"users",user.uid);

    const userSnap = await getDoc(userRef);

    if(!userSnap.exists()){

        location.href = "dashboard.html";

        return;

    }

    const data = userSnap.data();

    if(data.role !== "admin"){

        location.href = "dashboard.html";

        return;

    }

    currentAdmin = data.name || user.email;

    loadNotices();

});

publishBtn.addEventListener("click", async()=>{

    const noticeTitle = title.value.trim();

    const noticeMessage = message.value.trim();

    if(!noticeTitle || !noticeMessage){

        alert("Please fill in the title and message.");

        return;

    }

    publishBtn.disabled = true;

    publishBtn.textContent = editingId ?

        "Updating..."

        :

        "Publishing...";

    try{

        const noticeData = {

            title: noticeTitle,

            type: type.value,

            message: noticeMessage,

            pinned: pinned.checked,

            popup: popup.checked,

            createdBy: currentAdmin,

            updatedAt: serverTimestamp()

        };
                if(editingId){

            await updateDoc(

                doc(db,"notices",editingId),

                noticeData

            );

            alert("Notice updated successfully.");

        }

        else{

            noticeData.createdAt = serverTimestamp();

            await addDoc(

                collection(db,"notices"),

                noticeData

            );

            alert("Notice published successfully.");

        }

        clearForm();

        loadNotices();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    publishBtn.disabled = false;

    publishBtn.textContent = "➕ Publish Notice";

});

function clearForm(){

    editingId = null;

    title.value = "";

    type.value = "Announcement";

    message.value = "";

    pinned.checked = false;

    popup.checked = false;

}

async function loadNotices(){

    noticeList.innerHTML = `<div class="empty">Loading notices...</div>`;

    try{

        const snapshot = await getDocs(

            collection(db,"notices")

        );

        const notices = [];

        snapshot.forEach(docSnap=>{

            notices.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        notices.sort((a,b)=>{

            if((a.pinned||false)!==(b.pinned||false)){

                return (b.pinned||false)-(a.pinned||false);

            }

            const timeA = a.createdAt?.seconds || 0;

            const timeB = b.createdAt?.seconds || 0;

            return timeB - timeA;

        });

        if(notices.length===0){

            noticeList.innerHTML = `<div class="empty">No notices published yet.</div>`;

            return;

        }

        noticeList.innerHTML = "";
                notices.forEach(notice=>{

            const created = notice.createdAt

                ? notice.createdAt.toDate().toLocaleString()

                : "-";

            noticeList.innerHTML += `
<div class="noticeCard">
<div class="noticeTitle">${getTypeEmoji(notice.type)} ${notice.title}</div>

<div class="noticeType">${notice.type}</div>

<div class="noticeMessage">${notice.message}</div>

<div class="noticeInfo">
<span>📅 ${created}</span>
${notice.pinned ? "<span>📌 Pinned</span>" : ""}
${notice.popup ? "<span>📢 Popup</span>" : ""}
</div>

<div class="actions">

<button
class="editBtn"
onclick="editNotice('${notice.id}')">

✏️ Edit

</button>

<button
class="deleteBtn"
onclick="deleteNotice('${notice.id}')">

🗑️ Delete

</button>

</div>

</div>`;

        });

    }

    catch(error){

        console.error(error);

        noticeList.innerHTML = `
<div class="empty">
Failed to load notices.
</div>
`;

    }

}
window.editNotice = async function(id){

    try{

        const noticeRef = doc(db,"notices",id);

        const noticeSnap = await getDoc(noticeRef);

        if(!noticeSnap.exists()){

            alert("Notice not found.");

            return;

        }

        const notice = noticeSnap.data();

        editingId = id;

        title.value = notice.title || "";

        type.value = notice.type || "Announcement";

        message.value = notice.message || "";

        pinned.checked = notice.pinned || false;

        popup.checked = notice.popup || false;

        publishBtn.textContent = "💾 Update Notice";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

window.deleteNotice = async function(id){

    if(!confirm("Delete this notice?")){

        return;

    }

    try{

        await deleteDoc(doc(db,"notices",id));

        loadNotices();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

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