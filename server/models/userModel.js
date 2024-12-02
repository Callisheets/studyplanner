const mongoose = require('mongoose');


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
        select: false, 
    },
    verificationCode: {
        type: String,
        select: false, 
    },
    verificationCodeValidation: {
        type: Date,
        select: false, 
    },
    verified: {
        type: Boolean,
        default: false, 
    },
    forgotPasswordCode: {
        type: Number,
        select: false, 
    },
    forgotPasswordCodeValidation: {
        type: Date,
        select: false, 
    },
}, {
    timestamps: true 
});

// Export the User model
module.exports = mongoose.model('User ', userSchema);