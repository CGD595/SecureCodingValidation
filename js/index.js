const form = document.querySelector("form");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passToggleBtn = document.getElementById("pass-toggle-btn");
const confirmPassToggleBtn = document.getElementById("confirm-pass-toggle-btn");

const blacklistedWords = ["qwerty", "123", "abc", "password", "letmein", "welcome"];
const whitelistedEmails = [
    "gmail.com", 
    "icloud.com", 
    "rub.edu.bt",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "aol.com",
    "mail.com",
    "zoho.com",
    "protonmail.com",
    "tutanota.com",
    "gmx.com",
];

// Create a regex pattern for whitelisted email domains
const whitelistedEmailPattern = new RegExp(
    `^([a-zA-Z0-9._%+-]+)@(${whitelistedEmails.join('|')})$`
);


const showError = (field, errorText) => {
    field.classList.add("error");
    const errorElement = field.closest(".form-group").querySelector(".error-text");
    if (!errorElement) {
        const newErrorElement = document.createElement("small");
        newErrorElement.classList.add("error-text");
        newErrorElement.innerText = errorText;
        field.closest(".form-group").appendChild(newErrorElement);
    } else {
        errorElement.innerText = errorText;
    }
    // Reset border color if there is an error
    field.style.borderColor = "#f91919"; // Red color
    field.style.background = "#f9f0f1"; // Light red background
};

const clearError = (field) => {
    field.classList.remove("error");
    const errorElement = field.closest(".form-group").querySelector(".error-text");
    if (errorElement) {
        errorElement.remove();
    }
    // Add green border on success
    field.style.borderColor = "#4CAF50"; // Green color
    field.style.background = "#e8f5e9"; // Light green background
};

const capitalizeFullName = (input) => {
    const words = input.value.toLowerCase().split(' ');
    for (let i = 0; i < words.length; i++) {
        if (words[i]) {
            words[i] = words[i][0].toUpperCase() + words[i].substring(1);
        }
    }
    input.value = words.join(' ');
};

const validateField = (field) => {
    const fieldId = field.id;
    const value = field.value.trim();

    switch (fieldId) {
        case "fullname":
            capitalizeFullName(field);
            const fullname = value.toLowerCase();
            const namePattern = /^[a-zA-Z\s]+$/;
            if (fullname === "") {
                showError(field, "Enter your fullname");
            } else if (!namePattern.test(fullname)) {
                showError(field, "Full name should only contain alphabets");
            } else if (fullname.length < 3 || fullname.length > 25) {
                showError(field, "Full name must be between 3 to 25 characters");
            } else {
                clearError(field);
            }
            break;

        case "email":
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            const emailDomain = value.split('@')[1];
            if (!emailPattern.test(value)) {
                showError(field, "Invalid email address");
            } else if (!whitelistedEmails.includes(emailDomain)) {
                showError(field, "Email domain is not whitelisted");
            } else {
                clearError(field);
            }
            break;

        case "password":
            const lowercasePassword = value.toLowerCase();
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (value === "") {
                showError(field, "Enter your password");
            } else if (!passwordPattern.test(value)) {
                showError(field, "Password must contain at least 8 characters, including a capital letter, a lowercase letter, a number, and a special character");
            } else if (blacklistedWords.some((word) => lowercasePassword.includes(word))) {
                showError(field, "Password contains sequences");
            } else {
                clearError(field);
            }
            break;

        case "confirm-password":
            const password = document.getElementById("password").value.trim();
            if (value === "") {
                showError(field, "Confirm your password");
            } else if (password !== value) {
                showError(field, "Passwords do not match");
            } else {
                clearError(field);
            }
            break;

        case "age":
            const agePattern = /^[0-9]{1,3}$/;
            const age = parseInt(value, 10);
            if (value === "") {
                showError(field, "Enter your age");
            } else if (!agePattern.test(value) || age < 1 || age > 150) {
                showError(field, "Enter a valid age between 1 and 150");
            } else {
                clearError(field);
            }
            break;

        case "cid":
            const cidPattern = /^\d{11}$/;
            const hasAlphabets = /[a-zA-Z]/.test(value);
            const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
            if (value === "") {
                showError(field, "Enter your Citizen ID");
            } else if (hasAlphabets) {
                showError(field, "Citizen ID should not contain alphabets");
            } else if (hasSpecialChars) {
                showError(field, "Citizen ID should not contain special characters");
            } else if (!cidPattern.test(value)) {
                showError(field, "Citizen ID must be exactly 11 digits long");
            } else {
                clearError(field);
            }
            break;
            
        case "gender":
            if (value === "") {
                showError(field, "Select your gender");
            } else {
                clearError(field);
            }
            break;

        default:
            break;
    }
};

const handleFormData = (e) => {
    e.preventDefault();

    const fields = [
        document.getElementById("fullname"),
        document.getElementById("email"),
        document.getElementById("password"),
        document.getElementById("confirm-password"),
        document.getElementById("age"),
        document.getElementById("cid"),
        document.getElementById("gender")
    ];

    let valid = true;

    fields.forEach((field) => {
        validateField(field);
        if (field.closest(".form-group").querySelector(".error")) {
            valid = false;
        }
    });

    if (valid) {
        form.submit();
    }
};

document.querySelectorAll("input, select").forEach((field) => {
    field.addEventListener("input", () => validateField(field));
});

form.addEventListener("submit", handleFormData);

// Toggle password visibility
passToggleBtn.addEventListener("click", () => {
    passToggleBtn.className = passwordInput.type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

confirmPassToggleBtn.addEventListener("click", () => {
    confirmPassToggleBtn.className = confirmPasswordInput.type === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    confirmPasswordInput.type = confirmPasswordInput.type === "password" ? "text" : "password";
});

// Prevent password from being copied
const preventCopy = (input) => {
    input.addEventListener("copy", (e) => e.preventDefault());
    input.addEventListener("cut", (e) => e.preventDefault());
    input.addEventListener("paste", (e) => e.preventDefault());
};

preventCopy(passwordInput);
preventCopy(confirmPasswordInput);
