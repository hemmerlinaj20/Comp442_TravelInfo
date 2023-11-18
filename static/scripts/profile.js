
window.addEventListener("DOMContentLoaded", async => {

    // Get Change Name Field
    const changeNameField = document.getElementById("name-input");
    changeNameField.addEventListener("input", validateName);

    // Get Change Email Field
    const changeEmailField = document.getElementById("email-input");
    changeEmailField.addEventListener("input", validateEmail);

    // Get Change Password Fields
    const oldPasswordField = document.getElementById("old-password-input");
    oldPasswordField.addEventListener("input", validateOldPassword);

    const newPasswordField = document.getElementById("new-password-input");
    newPasswordField.addEventListener("input", validateNewPassword);
    newPasswordField.addEventListener("input", validateConfirmNewPassword);

    const confirmNewPasswordField = document.getElementById("confirm-new-password-input");
    confirmNewPasswordField.addEventListener("input", validateConfirmNewPassword);
});

function validateName(){
    // Get Name Field
    const changeNameField = document.getElementById("name-input");
    const name = changeNameField.value;

    const msg = name.length <= 256 ? "" : "Must Not Exceed 256 Characters";
    changeNameField.setCustomValidity(msg);
}

function validateEmail(){
    // Email Regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailField = document.getElementById("email-input");
    const email = emailField.value;

    const msg = emailRegex.test(email) ? "" : "Invalid Email Address";
    emailField.setCustomValidity(msg);
}

function validateOldPassword(){
    const oldPasswordField = document.getElementById("old-password-input");
    const oldPassword = oldPasswordField.value;
    
    const msg = oldPassword.length >= 8 ? "" : "Must be at least 8 characters";
    oldPasswordField.setCustomValidity(msg);
}

function validateNewPassword(){
    const newPasswordField = document.getElementById("new-password-input");
    const newPassword = newPasswordField.value;
    
    const msg = newPassword.length >= 8 ? "" : "Must be at least 8 characters";
    newPasswordField.setCustomValidity(msg);
}

function validateConfirmNewPassword(){
    const newPasswordField = document.getElementById("new-password-input");
    const confirmNewPasswordField = document.getElementById("confirm-new-password-input");

    const newPassword = newPasswordField.value;
    const confirmPassword = confirmNewPasswordField.value;

    const msg = confirmPassword === newPassword ? "" : "Password does not match";
    confirmNewPasswordField.setCustomValidity(msg);
}