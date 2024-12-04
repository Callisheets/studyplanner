const User = require('../models/userModel');
const Schedule = require('../models/scheduleModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginSchema, signupSchema } = require('../middlewares/validator');
const { sendMail } = require('../middlewares/sendMail');
const mongoose = require('mongoose');

// Signup function
const signup = async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { email, password } = req.body;
    try {
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ success: false, message: 'User  already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({
            email,
            password: hashedPassword,
        });
        await newUser .save();
        res.status(201).json({
            success: true,
            message: 'User  registered successfully.',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token, // Ensure this is being sent
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};

// Logout function
const logout = async (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Send verification code function
const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User  not found' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = verificationCode;
        await user.save();

        await sendMail(email, 'Your Verification Code', `Your verification code is ${verificationCode}`);

        res.status(200).json({ success: true, message: 'Verification code sent to your email' });
    } catch (error) {
        console.error('Send verification code error:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};

// Verify verification code function
const verifyVerificationCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User  not found' });
        }

        // Check if the provided code matches the stored verification code
        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        // Update the user's verified status
        user.verified = true; // Set verified to true
        user.verificationCode = null; // Clear the verification code
        console.log('Before saving user:', user); // Log the user object before saving
        await user.save(); // Save the changes to the database
        console.log('After saving user:', user); // Log the user object after saving

        res.status(200).json({ success: true, message: 'Account verified successfully' });
    } catch (error) {
        console.error('Verify verification code error:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};

// Create a new schedule
const createSchedule = async (req, res) => {
    const { event, date } = req.body;
    const userId = req.user.id; // Assuming you have set req.user .id in your authentication middleware

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Validate event
    if (!event || typeof event !== 'string' || event.trim() === '') {
        return res.status(400).json({ error: 'Event name is required' });
    }

    // Validate date
    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({ error: 'Valid date is required' });
    }

    try {
        const newSchedule = new Schedule({ userId, event, date });
        await newSchedule.save();
        res.status(201).json({
            schedule: newSchedule,
            message: 'Schedule created successfully',
        });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Error creating schedule' });
    }
};

// Get user schedules
const getUserSchedule = async (req, res) => {
    const userId = req.user.id; // Get the user ID from the request object
    try {
        const schedules = await Schedule.find({ userId }); // Fetch schedules for the user
        res.status(200).json({ schedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Error fetching schedules' });
    }
};

// Export all functions
module.exports = {
    signup,
    login,
    logout,
    sendVerificationCode,
    verifyVerificationCode,
    createSchedule,
    getUserSchedule,
};