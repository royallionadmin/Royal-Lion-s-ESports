import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const membersContainer =
    document.getElementById("membersContainer");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter");

let allMembers = [];

let selectedStatus = null;


onAuthStateChanged(auth, async (user) => {

    if (!user) {

        location.href = "index.html";

        return;

    }

    try {

        const adminRef =
            doc(db, "users", user.uid);

        const adminSnap =
            await getDoc(adminRef);


        if (
            !adminSnap.exists() ||
            adminSnap.data().role !== "admin"
        ) {

            alert("Admins only.");

            location.href = "dashboard.html";

            return;

        }


        await loadMembers();

    }

    catch (error) {

        console.error(error);

        membersContainer.innerHTML = `
            <div class="empty">
                Failed to load members.
            </div>
        `;

    }

});


async function loadMembers() {

    membersContainer.innerHTML = `
        <div class="empty">
            Loading members...
        </div>
    `;


    const snapshot =
        await getDocs(
            collection(db, "users")
        );


    allMembers = [];


    snapshot.forEach((docSnap) => {

        allMembers.push({

            id: docSnap.id,

            ...docSnap.data()

        });

    });


    applyFilters();

}


searchInput.addEventListener("input", () => {

    applyFilters();

});


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const status =
            button.dataset.status;


        if (selectedStatus === status) {

            selectedStatus = null;

            button.classList.remove("active");

        }

        else {

            selectedStatus = status;


            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");

        }


        applyFilters();

    });

});


function applyFilters() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        allMembers.filter(member => {

            const matchesStatus =
                !selectedStatus ||
                (member.status || "Pending") === selectedStatus;


            const matchesSearch =

                (member.name || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (member.email || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (member.team || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (member.uid || "")
                    .toLowerCase()
                    .includes(search);


            return matchesStatus && matchesSearch;

        });


    renderMembers(filtered);

}


function renderMembers(members) {

    membersContainer.innerHTML = "";


    if (members.length === 0) {

        membersContainer.innerHTML = `
            <div class="empty">
                No members found.
            </div>
        `;

        return;

    }


    members.forEach(member => {

        const card =
            document.createElement("div");

        card.className = "member";


        card.innerHTML = `

            <h3>
                ${member.name || "-"}
            </h3>

            <div class="info">
                📧 ${member.email || "-"}
            </div>

            <div class="info">
                👥 Team:
                ${member.team || "Unassigned"}
            </div>

            <div class="info">
                Current Status:
                ${getStatusLabel(member.status)}
            </div>

            <label>
                Change Status
            </label>

            <select class="status">

                <option
                    value="Active"
                    ${member.status === "Active" ? "selected" : ""}
                >
                    🟢 Active
                </option>

                <option
                    value="Pending"
                    ${member.status === "Pending" ? "selected" : ""}
                >
                    🟡 Pending
                </option>

                <option
                    value="Suspended"
                    ${member.status === "Suspended" ? "selected" : ""}
                >
                    🔴 Suspended
                </option>

            </select>

            <button class="save">

                💾 Save Status

            </button>

        `;


        const saveButton =
            card.querySelector(".save");

        const statusSelect =
            card.querySelector(".status");


        saveButton.onclick = async () => {

            saveButton.disabled = true;

            saveButton.textContent =
                "Saving...";


            try {

                await updateDoc(

                    doc(db, "users", member.id),

                    {
                        status:
                            statusSelect.value
                    }

                );


                member.status =
                    statusSelect.value;


                saveButton.textContent =
                    "✅ Saved";


                setTimeout(() => {

                    saveButton.disabled = false;

                    saveButton.textContent =
                        "💾 Save Status";

                    applyFilters();

                }, 1000);

            }

            catch (error) {

                console.error(error);

                saveButton.textContent =
                    "❌ Failed";


                setTimeout(() => {

                    saveButton.disabled = false;

                    saveButton.textContent =
                        "💾 Save Status";

                }, 1500);

            }

        };


        membersContainer.appendChild(card);

    });

}
function getStatusLabel(status){

    switch(status){

        case "Active":
            return "🟢 Active";

        case "Pending":
            return "🟡 Pending";

        case "Suspended":
            return "🔴 Suspended";

        default:
            return "🟡 Pending";

    }

}