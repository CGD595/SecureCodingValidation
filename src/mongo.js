const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect("mongodb://localhost:27017/SecureCoding")
.then(()=>{
    console.log('Mongoose Connected');
})
.catch((e)=>{
    console.log('Connection failed:', e);
});

const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [25, 'Name cannot be longer than 25 characters'],
        match: [/^[a-zA-Z\s]+$/, 'Name should only contain alphabets']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: function(value) {
                // Custom validator for email domain
                const whitelistedEmails = [
                    "gmail.com", "icloud.com", "rub.edu.bt", "yahoo.com", "hotmail.com",
                    "outlook.com", "aol.com", "mail.com", "zoho.com", "protonmail.com", "tutanota.com", "gmx.com"
                ];
                const emailDomain = value.split('@')[1];
                return whitelistedEmails.includes(emailDomain);
            },
            message: props => `${props.value} is not a whitelisted email domain`
        },
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be at least 1'],
        max: [150, 'Age must be at most 150']
    },
    cid: {
        type: String,
        required: [true, 'Citizen ID is required'],
        match: [/^\d{11}$/, 'Citizen ID must be exactly 11 digits long']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'Other'],
        message: 'Gender must be Male, Female, or Other'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: function(value) {
                const blacklistedWords = ["qwerty", "123", "abc", "password", "letmein", "welcome"];
                const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                const lowercasePassword = value.toLowerCase();
                return passwordPattern.test(value) && !blacklistedWords.some((word) => lowercasePassword.includes(word));
            },
            message: 'Password must contain at least 8 characters, including a capital letter, a lowercase letter, a number, and a special character. It cannot contain blacklisted words like "qwerty", "password", etc.'
        }
    }
});

const LogInCollection = mongoose.model('LogInCollection', logInSchema);

module.exports = LogInCollection;
