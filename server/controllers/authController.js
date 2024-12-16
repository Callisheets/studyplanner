const User = require('../models/userModel');
const Schedule = require('../models/scheduleModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginSchema, signupSchema } = require('../middlewares/validator');
const { sendMail } = require('../middlewares/sendMail');
const mongoose = require('mongoose');

// Utility function for error responses
const handleError = (res, error, message = 'An error occurred.') => {
    console.error(message, error);
    return res.status(500).json({ success: false, message });
};

// Signup function
const signup = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Email, password, and name are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, name });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        handleError(res, error, 'Signup error:');
    }
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, message: 'Login successful.', token });
    } catch (error) {
        handleError(res, error, 'Login error:');
    }
};

// Logout function
const logout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

// Send verification code function
const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.verified) {
            return res.status(400).json({ success: false, message: 'User is already verified.' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await sendMail(user.email, 'Verification Code', `Your verification code is ${verificationCode}`);

        user.verificationCode = verificationCode;
        user.verificationCodeValidation = Date.now();
        await user.save();

        res.status(200).json({ success: true, message: 'Verification code sent successfully.' });
    } catch (error) {
        handleError(res, error, 'Error sending verification code:');
    }
};

// Verify verification code function
const verifyVerificationCode = async (req, res) => {
    const { providedCode } = req.body;

    if (!providedCode) {
        return res.status(400).json({ success: false, message: 'Verification code is required.' });
    }

    try {
        const user = await User.findOne({ verificationCode: providedCode });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid verification code or user not found.' });
        }

        user.verified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ success: true, message: 'Verification successful.' });
    } catch (error) {
        handleError(res, error, 'Error verifying verification code:');
    }
};

// Create a new schedule
const createSchedule = async (req, res) => {
    const { event, date, time } = req.body;
    const userId = req.user.id;

    if (!event || !date || !time) {
        return res.status(400).json({ success: false, message: 'Event, date, and time are required.' });
    }

    try {
        const newSchedule = new Schedule({ event, date, time, userId });
        await newSchedule.save();

        const user = await User.findById(userId);
        if (user?.email) {
            await sendMail(user.email, 'New Schedule Created', `Your schedule for "${event}" on ${new Date(date).toLocaleString()} at ${time} has been created.`);
        }

        res.status(201).json({ success: true, schedule: newSchedule });
    } catch (error) {
        handleError(res, error, 'Error creating schedule:');
    }
};

// Get user schedules
const getUserSchedule = async (req, res) => {
    const userId = req.user.id;

    try {
        const schedules = await Schedule.find({ userId });
        res.status(200).json({ success: true, schedules });
    } catch (error) {
        handleError(res, error, 'Error fetching schedules:');
    }
};

module.exports = {
    signup,
    login,
    logout,
    sendVerificationCode,
    verifyVerificationCode,
    createSchedule,
    getUserSchedule,
};
