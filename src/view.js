import { databases } from './appwrite.js';
// Get the ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id'); // Ensure URL has ?id=(ID)
var g_truckNumber = "";

// Fetch the truck details from the API
if (id) {
    const data = await databases.getDocument(
        'tst', // databaseId
        '669cbcd30006ae923e3c', // collectionId
        id  // documentId
    );
    const img = document.getElementById('image');
    const tn = document.getElementById('TruckNumber');
    img.src = data.Picture; // Use the Picture URL from the response
    tn.textContent = "Truck Number: " +data.Number;
    g_truckNumber = data.Number;
    const allSkeleton = document.querySelectorAll('.skeleton');
    allSkeleton.forEach(item => {
        item.classList.remove('skeleton');
    });
} else {
    console.error('No ID found in the URL');
}





function deleteTruck() {
    fetch(`https://api.backendless.com/C7DCE9F8-9E7D-4D56-BFB5-A0315B70F95C/1324AB59-19C3-400A-A57F-48AADA065503/data/Trucks/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            window.location.href = 'index.html';
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));

    //http://api.backendless.com/C7DCE9F8-9E7D-4D56-BFB5-A0315B70F95C/1324AB59-19C3-400A-A57F-48AADA065503/files/:filePath
    fetch(`https://api.backendless.com/C7DCE9F8-9E7D-4D56-BFB5-A0315B70F95C/1324AB59-19C3-400A-A57F-48AADA065503/files/trucks/IMG_${g_truckNumber}.webp`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            window.location.href = 'index.html';
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}