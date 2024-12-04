const User = require('../models/userModel'); 
const Schedule = require('../models/scheduleModel');
const Note = require('../models/noteModel');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const { loginSchema, signupSchema } = require('../middlewares/validator');
const { sendMail } = require('../middlewares/sendMail');


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
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};


const logout = async (req, res) => {
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};


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
        res
.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};


const verifyVerificationCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User  not found' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

       
        user.isVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ success: true, message: 'Account verified successfully' });
    } catch (error) {
        console.error('Verify verification code error:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};

// Create a new schedule function
const createSchedule = async (req, res) => {
    const { userId, event, date } = req.body;
    try {
        const newSchedule = new Schedule({ userId, event , date });
        await newSchedule.save();
        res.status(201).json({
            success: true,
            message: 'Schedule created successfully',
            schedule: newSchedule,
        });
    } catch (error) {
        console.error('Create schedule error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while creating the schedule' });
    }
};

// Get user schedules function
const getUserSchedules = async (req, res) => {
    const { userId } = req.params;
    try {
        const schedules = await Schedule.find({ userId });
        res.status(200).json({
            success: true,
            schedules,
        });
    } catch (error) {
        console.error('Get user schedules error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching schedules' });
    }
};

// Exporting the controller functions
module.exports = {
    signup,
    login,
    logout,
    sendVerificationCode,
    verifyVerificationCode,
    createSchedule,
    getUserSchedules, // Ensure this is correctly referenced
}; 