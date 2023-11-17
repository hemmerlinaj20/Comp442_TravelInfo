window.addEventListener("DOMContentLoaded", async () => {
    const emailField = document.getElementById("email");
    emailField.addEventListener("input", validateEmailAddress);

    const passwordField = document.getElementById("password");
    passwordField.addEventListener("input", validatePassword);

    const confirmPasswordField = document.getElementById("confirm_password");
    confirmPasswordField.addEventListener("input", validateConfirmPassword);
});

// define a function to check that the email is valid
function validateEmailAddress() {
    // include an email regex for later . . .
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailField = document.getElementById("email");
    const email = emailField.value;

    const msg = emailRegex.test(email) ? "" : "Invalid Email Address";
    emailField.setCustomValidity(msg);
}

function validatePassword(){
    const passwordField = document.getElementById("password");
    const password = passwordField.value;
    const msg = password.length >= 8 ? "" : "Must be at least 8 characters";
    passwordField.setCustomValidity(msg);
}

function validateConfirmPassword(){
    const confirmField = document.getElementById("confirm_password");
    const confirm = confirmField.value;
    const passwordField = document.getElementById("password");
    const password = passwordField.value;

    const msg = confirm === password ? "" : "Password does not match";
    confirmField.setCustomValidity(msg);
}