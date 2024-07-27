import { login } from './appwrite.js';
const loginForm = document.getElementById("login-form");
loginForm.addEventListener('submit', LogInFunc);


function LogInFunc() {
    event.preventDefault();
    const emailInput = document.getElementById("email-input").value;
    const passwordInput = document.getElementById("password-input").value;
    login(emailInput, passwordInput)
    .then((account) => {
        window.alert("Logged in as " + account.current);
        window.location = "./truck.html";
    })
    .catch((error) => {
        window.alert("Login failed: " + error.message);
    });
}