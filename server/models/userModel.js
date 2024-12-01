const mongoose = require('mongoose');

// Define the user schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        trim: true,
        unique: [true, 'Email must be unique!'],
        min: [5, "Email must have unique characters!"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        trim: true,
        select: false, // Do not return the password by default
    },
    verificationCode: {
        type: String,
        select: false, // Do not return the verification code by default
    },
    verificationCodeValidation: {
        type: Date,
        select: false, // Do not return the validation time by default
    },
    verified: {
        type: Boolean,
        default: false, // Default value for verification status
    },
    forgotPasswordCode: {
        type: Number,
        select: false, // Do not return the forgot password code by default
    },
    forgotPasswordCodeValidation: {
        type: Date,
        select: false, // Do not return the forgot password validation time by default
    },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Export the User model
module.exports = mongoose.model('User ', userSchema);