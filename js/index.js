const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passToggleBtn = document.getElementById("pass-toggle-btn");
const confirmPassToggleBtn = document.getElementById("confirm-pass-toggle-btn");

// Function to display error messages
const showError = (field, errorText) => {
    field.classList.add("error");
    const errorElement = document.createElement("small");
    errorElement.classList.add("error-text");
    errorElement.innerText = errorText;
    field.closest(".form-group").appendChild(errorElement);
}

// Function to handle form submission
const handleFormData = (e) => {
    e.preventDefault();

    // Retrieving input elements
    const fullnameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");
    const dateInput = document.getElementById("date");
    const genderInput = document.getElementById("gender");
    const ageInput = document.getElementById("age");
    const cidInput = document.getElementById("cid");

    // Getting trimmed values from input fields
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const date = dateInput.value;
    const gender = genderInput.value;
    const age = ageInput.value.trim();
    const cid = cidInput.value.trim();

    // Regular expression patterns for validation
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const agePattern = /^[0-9]{1,3}$/;
    const cidPattern = /^\d{11}$/;

    // Clearing previous error messages
    document.querySelectorAll(".form-group .error").forEach(field => field.classList.remove("error"));
    document.querySelectorAll(".error-text").forEach(errorText => errorText.remove());

    // Performing validation checks
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

    if (date === "") {
        showError(dateInput, "Select your date of birth");
    }

    if (gender === "") {
        showError(genderInput, "Select your gender");
    }
    
    // Checking for any remaining errors before form submission
    const errorInputs = document.querySelectorAll(".form-group .error");
    if (errorInputs.length > 0) return;

    // Submitting the form
    form.submit();
}

// Toggling password visibility
passToggleBtn.addEventListener('click', () => {
    passToggleBtn.className = passwordInput.type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

confirmPassToggleBtn.addEventListener('click', () => {
    confirmPassToggleBtn.className = confirmPasswordInput.type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    confirmPasswordInput.type = confirmPasswordInput.type === "password" ? "text" : "password";
});

// Handling form submission event
form.addEventListener("submit", handleFormData);
