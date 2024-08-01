import { getUserData, avatars, logout, roles, databases, storage } from './appwrite.js';
import { getCurrentPage, userLang, loadLanguage } from './translate.js';
import { ID, Query } from "appwrite";
import { uploadImage } from './images.js';
import { Notyf } from 'notyf';

//References
const notyf = new Notyf({
    duration: 2500,
    position: {
        x: 'right',
        y: 'bottom',
    }
});
const languageSelect = document.getElementById("language-select");
const logOutBtn = document.getElementById('logout-btn');
const menuIcon = document.getElementById('checkbox');
const sideBar = document.getElementById('sidebar');
const refreshBtn = document.getElementById('refresh-btn');
const formAdd = document.getElementById('addForm-Submit');
const fileInput = document.getElementById('fileInput');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});
window.addEventListener('load', () => {
    //console.log('Page fully loaded');
});
async function Initialize() {
    notyf.loading('Loading trucks...');
    populateGrid();
    await getUserData()
        .then((account) => setUserData(account))
        .catch((error) => {
            navigate('./login.html');
        });
    //add event listeners
    languageSelect.addEventListener("change", function () {
        localStorage.setItem("userLang", languageSelect.value);
        location.reload();
    });
    logOutBtn.addEventListener('click', logOut);
    menuIcon.addEventListener('click', handleSideBar);
    refreshBtn.addEventListener('click', checkForUpdates);
    formAdd.addEventListener('submit', postTruck);
    searchBar.addEventListener('keyup', searchTrucksFromInput);
    searchBtn.addEventListener('click', searchTrucks);
    fileInput.addEventListener('change', ImageChanged);
}
function handleSideBar() {
    sideBar.classList.toggle('active');
}
async function setUserData(account) {
    //profile Picture
    const profilePicture = await document.getElementById('profile-picture');
    const profilePicture2 = await document.getElementById('profile-picture2');


    //username
    const t_username = await account.name;
    const username = await document.getElementById('user-name');
    username.textContent = t_username;
    //avatar
    const avatar = await avatars.getInitials(t_username);
    profilePicture.src = await avatar.href;
    profilePicture2.src = await avatar.href;
    //role
    const role = await roles.list();
    if (role.teams.length > 0) {
        document.getElementById('user-team').textContent = role.teams[0].name;
        // Get all the menu items
        const menuItems = document.querySelectorAll('#sidebar a');

        menuItems.forEach(item => {
            // Get the roles that can see this item
            const roles = item.getAttribute('data-role').split(',');
            // Check if the current user's role is included
            if (roles.includes(role.teams[0].name)) {
                item.style.display = 'block'; // Show the item
            } else {
                item.style.display = 'none'; // Hide the item
            }
        });
    }
    loadTrucks();
}


//#region CRUD Functions
//#region Post
async function postTruck() {
    event.preventDefault();
    const input = document.getElementById('TruckNumberInputField');
    const truckNumber = input.value.trim();
    if (truckNumber == "") {
        //hideLoader();
        notyf.error('Please enter a Truck number');
        return;
    }
    if (fileInput.files.length == 0) {
        notyf.error('Please select a file to upload');
        return;
    }
    const modal = document.querySelector("[add-modal]")
    modal.close();
    notyf.loading('Uploading truck...');
    const imageNotyf= notyf.loading('Uploading trrck image...');
    const fileURL = await uploadImage(fileInput.files[0], truckNumber);
    notyf.dismiss(imageNotyf);
    try {
        const result = await databases.createDocument(
            'tst', // databaseId
            '669cbcd30006ae923e3c', // collectionId
            ID.unique(),// documentId
            {
                Number: truckNumber,
                Picture: fileURL
            }
        );
        notyf.dismissAll();
        notyf.success("Truck " + truckNumber + " uploaded successfully");
        SilentLoadTrucks();
    } catch (error) {
        notyf.dismissAll();
        notyf.error("Error uploading truck: " + error.message);
    }
}
//#endregion
//#region Get
const grid = document.querySelector('.video-grid');
const cardTemplate = document.querySelector('#card-template');
async function loadTrucks() {
    const trucksData = await databases.listDocuments('tst', '669cbcd30006ae923e3c');
    const truckList = Object.values(trucksData.documents);
    try {
        grid.innerHTML = '';
        const i = 1;
        truckList.forEach(truck => {

            const div = cardTemplate.content.cloneNode(true);
            div.querySelector('[data-link]').href = "view.html?id=" + truck.$id;
            div.querySelector('[data-thumbnail]').src = truck.Picture;
            div.querySelector('[data-title]').textContent = truck.Number;
            //div.querySelector('[data-title]').setAttribute('truck', truck.$id);
            const deleteOpenModal = div.querySelector('#delete-open-modal');
            deleteOpenModal.addEventListener('click', function () {
                event.preventDefault();
                deleteTruck(truck.$id, truck.Number);
            })
            grid.appendChild(div);
        });
        loadLanguage();
        const allSkeleton = document.querySelectorAll('.skeleton');
        allSkeleton.forEach(item => {
            item.classList.remove('skeleton');
        });
        notyf.dismissAll();
        notyf.success("Trucks loaded successfully");
    } catch (error) {
        notyf.error("Error loading trucks: " + error.message);
    }
}
async function SilentLoadTrucks() {
    const trucksData = await databases.listDocuments('tst', '669cbcd30006ae923e3c');
    const truckList = Object.values(trucksData.documents);
    try {
        grid.innerHTML = '';
        const i = 1;
        truckList.forEach(truck => {
            const div = cardTemplate.content.cloneNode(true);
            div.querySelector('[data-link]').href = "view.html?id=" + truck.$id;
            div.querySelector('[data-thumbnail]').src = truck.Picture;
            div.querySelector('[data-title]').textContent = truck.Number;
            //div.querySelector('[data-title]').setAttribute('truck', truck.$id);
            const deleteOpenModal = div.querySelector('#delete-open-modal');
            deleteOpenModal.addEventListener('click', function () {
                event.preventDefault();
                deleteTruck(truck.$id, truck.Number);
            })
            grid.appendChild(div);
        });
        loadLanguage();
        const allSkeleton = document.querySelectorAll('.skeleton');
        allSkeleton.forEach(item => {
            item.classList.remove('skeleton');
        });
    } catch (error) {
        notyf.error("Error loading trucks: " + error.message);
    }
}


async function searchTrucksFromInput() {
    if (event.key == 'Enter' || searchBar.value == '') {
        searchTrucks();
    }
}
async function searchTrucks() {
    const trucksData = await databases.listDocuments(
        'tst',
        '669cbcd30006ae923e3c',
        [
            Query.contains('Number', searchBar.value)
        ]
    );
    const truckList = Object.values(trucksData.documents);
    if (truckList.length == 0) {
        grid.innerHTML = '';
        const fileURL = await storage.getFileView('669cbd410034f5902774', "66a19b800001e760d48d");
        const div = cardTemplate.content.cloneNode(true);
        div.querySelector('[data-link]').href = "#";
        div.querySelector('[data-thumbnail]').src = fileURL;
        div.querySelector('[data-title]').textContent = "No results Found";
        grid.appendChild(div);
        const allSkeleton = document.querySelectorAll('.skeleton');
        allSkeleton.forEach(item => {
            item.classList.remove('skeleton');
        });
        return;
    }
    try {
        // Save the result to localStorage
        //localStorage.setItem(cacheKey, JSON.stringify(result));
        // Clear the grid before loading actual trucks
        grid.innerHTML = '';
        const response = await fetch(`../languages/${userLang}.json`);
        const translations = await response.json();
        const currentPage = await getCurrentPage();
        console.log(currentPage);
        truckList.forEach(truck => {
            const div = cardTemplate.content.cloneNode(true);
            div.querySelector('[data-link]').href = "view.html?id=" + truck.$id;
            div.querySelector('[data-thumbnail]').src = truck.Picture;
            div.querySelector('[data-title]').textContent = truck.Number;
            const info = translations[currentPage]['video_info'];
            div.querySelector('[data-info]').textContent = info;
            grid.appendChild(div);
            console.log(truck);
        });

        const allSkeleton = document.querySelectorAll('.skeleton');
        allSkeleton.forEach(item => {
            item.classList.remove('skeleton');
        });
    } catch (error) {
        notyf.error("Error searching trucks: " + error.message);
    }
}





//#endregion
//#region Delete
async function deleteTruck(truckId, truckNumber) {
    if (!confirm('Are you sure you want to delete Truck ' + truckNumber + '?')) {
        return;
    }
    try {
        notyf.loading("Deleting truck...");
        await databases.deleteDocument('tst', '669cbcd30006ae923e3c', truckId);
        notyf.dismissAll();
        notyf.success("Truck deleted successfully");
        SilentLoadTrucks();
    } catch (error) {
        console.error('Error:', error);
    }
}
//#endregion
//#endregion


function ImageChanged() {
    const uploadButton = document.getElementById('uploadButton').querySelector('span');
    uploadButton.textContent = fileInput.files[0].name; // Update button text to show the file name
}



//#region Load the grid with the fake templates

const videoHeight = 200 + 16; // Video height + gap
const gridPadding = 32 * 2; // Padding from both sides
const videoWidth = 300 + 16; // Video width + gap

function getNumberOfVideosToFit() {
    const gridWidth = window.innerWidth - gridPadding;
    const gridHeight = window.innerHeight - gridPadding;
    const columns = Math.floor(gridWidth / videoWidth);
    const rows = Math.floor(gridHeight / videoHeight);
    return columns * rows;
}

function populateGrid() {
    const grid = document.querySelector('.video-grid');
    const cardTemplate = document.querySelector('#card-template');
    const numberOfVideos = getNumberOfVideosToFit();

    for (let i = 0; i < numberOfVideos; i++) {
        const div = cardTemplate.content.cloneNode(true);
        div.querySelector('[data-title]').textContent = "Loading...";
        grid.appendChild(div);
    }
}

//#endregion
const cooldownKey = 'lastApiCallTimestamp';
const cooldownDuration = 10000; // 10 seconds = 10000 milliseconds(production),    60 seconds = 60000 milliseconds (development)    (Uses milliseconds)
async function checkForUpdates() {
    const lastApiCall = localStorage.getItem(cooldownKey);
    const now = new Date().getTime();
    // Check if cooldown period has passed
    if (lastApiCall && (now - lastApiCall < cooldownDuration)) {
        notyf.error('Wait for ' + Math.ceil((cooldownDuration - (now - lastApiCall)) / 1000) + ' seconds before checking for updates again');
        return;
    }
    try {
        notyf.loading('Loading trucks...');
        localStorage.setItem(cooldownKey, now); // Update the last API call timestamp
        loadTrucks();
    } catch (error) {
        notyf.dismissAll();
        notyf.error("Error refreshing trucks: " + error.message);
    }
}







async function logOut() {
    logout()
        .then((account) => navigate('./login.html'));
}
function navigate(url) {
    window.location.assign(url);
}