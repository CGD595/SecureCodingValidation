const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passToggleBtn = document.getElementById("pass-toggle-btn");
const confirmPassToggleBtn = document.getElementById("confirm-pass-toggle-btn");


const showError = (field, errorText) => {
    field.classList.add("error");
    const errorElement = document.createElement("small");
    errorElement.classList.add("error-text");
    errorElement.innerText = errorText;
    field.closest(".form-group").appendChild(errorElement);
}

const handleFormData = (e) => {
    e.preventDefault();

    const fullnameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");
    const genderInput = document.getElementById("gender");
    const ageInput = document.getElementById("age");
    const cidInput = document.getElementById("cid");

    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const gender = genderInput.value;
    const age = ageInput.value.trim();
    const cid = cidInput.value.trim();

    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const agePattern = /^[0-9]{1,3}$/;
    const cidPattern = /^\d{11}$/;


    document.querySelectorAll(".form-group .error").forEach(field => field.classList.remove("error"));
    document.querySelectorAll(".error-text").forEach(errorText => errorText.remove());


    if (fullname === "") {
        showError(fullnameInput, "Enter your Username");
    } else if (!namePattern.test(fullname)) {
        showError(fullnameInput, "Full name should only contain alphabets and spaces");
    }

    if (!emailPattern.test(email)) {
        showError(emailInput, "Enter a valid email address");
    }

    if (password === "") {
        showError(passwordInput, "Enter your password");
    } else if (!passwordPattern.test(password)) {
        showError(passwordInput, "Password must contain at least 8 characters, including a capital letter, a lowercase letter, a number, and a special character");
    }

    if (confirmPassword === "") {
        showError(confirmPasswordInput, "Confirm your password");
    } else if (password !== confirmPassword) {
        showError(confirmPasswordInput, "Passwords do not match");
    }

    if (age === "") {
        showError(ageInput, "Enter your age");
    } else if (!agePattern.test(age) || age < 0 || age > 150) {
        showError(ageInput, "Enter a valid age between 0 and 150");
    }

    if (cid === "") {
        showError(cidInput, "Enter your Citizen ID");
    } else if (!cidPattern.test(cid)) {
        showError(cidInput, "Citizen ID must be an 11-digit number and not alphabets or special characters");
    } 

    if (gender === "") {
        showError(genderInput, "Select your gender");
    }
    

    const errorInputs = document.querySelectorAll(".form-group .error");
    if (errorInputs.length > 0) return;

    form.submit();
}

passToggleBtn.addEventListener('click', () => {
    passToggleBtn.className = passwordInput.type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

confirmPassToggleBtn.addEventListener('click', () => {
    confirmPassToggleBtn.className = confirmPasswordInput.type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    confirmPasswordInput.type = confirmPasswordInput.type === "password" ? "text" : "password";
});

form.addEventListener("submit", handleFormData);
