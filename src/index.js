const express = require("express");
const path = require("path");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const LogInCollection = require("./mongo");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "template/css" and "js" directories
app.use(express.static(path.join(__dirname, '../template/css')));
app.use(express.static(path.join(__dirname, '../js')));

// Parse incoming requests with URL-encoded payloads and JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Signup route with validation and hashing password
app.post('/signup', [
    body('name').trim().isLength({ min: 3, max: 25 }).withMessage('Full name must be between 3 to 25 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Full name should only contain alphabets'),
    body('email').trim().isEmail().withMessage('Invalid email address')
        .custom(isValidEmailDomain).withMessage('Email domain is not whitelisted'),
    body('password').trim().custom(isStrongPassword).withMessage('Password must contain at least 8 characters, including a capital letter, a lowercase letter, a number, and a special character'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    body('age').isInt({ min: 1, max: 150 }).withMessage('Enter a valid age between 1 and 150'),
    body('cid').matches(/^\d{11}$/).withMessage('Citizen ID must be exactly 11 digits long'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Select your gender')
], async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    try {
        const existingUser = await LogInCollection.findOne({ name: req.body.name });

        if (existingUser) {
            return res.status(400).send("User details already exist");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new LogInCollection({
            name: req.body.name,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).send("Signup successful!");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

// Login route with validation
app.post('/login', [
    body('name').trim().notEmpty().withMessage('Enter your name'),
    body('password').trim().notEmpty().withMessage('Enter your password')
], async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
    }

    try {
        const user = await LogInCollection.findOne({ name: req.body.name });

        if (!user) {
            return res.status(400).send("Incorrect details");
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(400).send("Incorrect password");
        }

        res.status(201).send("Login successful!");
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Custom validation functions
const isValidEmailDomain = (value) => {
    const whitelistedEmails = [
        "gmail.com", "icloud.com", "rub.edu.bt", "yahoo.com", "hotmail.com",
        "outlook.com", "aol.com", "mail.com", "zoho.com", "protonmail.com", "tutanota.com", "gmx.com"
    ];
    const emailDomain = value.split('@')[1];
    return whitelistedEmails.includes(emailDomain);
};

const isStrongPassword = (value) => {
    const blacklistedWords = ["qwerty", "123", "abc", "password", "letmein", "welcome"];
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const lowercasePassword = value.toLowerCase();
    return passwordPattern.test(value) && !blacklistedWords.some((word) => lowercasePassword.includes(word));
};
