import { getUserData } from './appwrite.js';
document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});
async function Initialize() {
    getUserData()
    .then ((account) => setUserData(account))
    .catch((error) => navigate('login.html'));
}



function setUserData(account) {
    const t_username = account.name;
    window.alert(t_username);
}
function navigate(url) {
    window.alert(url);
    window.location.assign(url);
}