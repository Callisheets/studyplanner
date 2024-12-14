const User = require('../models/userModel');
const Schedule = require('../models/scheduleModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginSchema, signupSchema } = require('../middlewares/validator');
const { sendMail } = require('../middlewares/sendMail');
const mongoose = require('mongoose');
const cron = require('node-cron');

// Signup function
const signup = async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        console.error('Signup error:', error);
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
        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            userId: user._id,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};

// Logout function
const logout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// Send verification code function
const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
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
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        user.verified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ success: true, message: 'Account verified successfully' });
    } catch (error) {
        console.error('Verify verification code error:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
};

// Create a new schedule
const createSchedule = async (req, res) => {
    const { event, date, time } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!event || !date || !time) {
        return res.status(400).json({ message: 'Event, date, and time are required.' });
    }

    try {
        const newSchedule = new Schedule({ event, date, time, userId });
        await newSchedule.save();

        const user = await User.findById(userId);
        if (user?.email) {
            // Log the email details before sending
            console.log(`Sending email to: ${user.email}`);
            console.log(`Email subject: New Schedule Created`);
            console.log(`Email content: Your schedule for "${event}" on ${new Date(date).toLocaleString()} at ${time} has been created.`);

            // Send email notification
            await sendMail(user.email, 'New Schedule Created', `Your schedule for "${event}" on ${new Date(date).toLocaleString()} at ${time} has been created.`);
        }

        res.status(201).json({ schedule: newSchedule }); 
    } catch (error) {
        console.error('Error creating schedule:', error); 
        res.status(500).json({ message: 'Error creating schedule', error: error.message }); 
    }
};

// Get user schedules
const getUserSchedule = async (req, res) => {
    const userId = req.user.id;

    try {
        const schedules = await Schedule.find({ userId });
        res.status(200).json({ success: true, schedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ success: false, message: 'Error fetching schedules' });
    }
};

// Set up a cron job to send reminders daily
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 

        // Find schedules for today
        const events = await Schedule.find({ date: { $gte: today, $lt: tomorrow } });

        if (events.length === 0) {
            console.log('No events found for today');
            return;
        }

        for (const event of events) {
            const user = await User.findById(event.userId);

            if (user?.email) {
                const reminderTime = new Date(event.date).toLocaleString();

                // Log the email details before sending
                console.log(`Sending reminder email to: ${user.email}`);
                console.log(`Reminder subject: Today's Event Reminder`);
                console.log(`Reminder content: Your event "${event.event}" is scheduled for ${reminderTime}.`);

                try {
                    await sendMail(user.email, 'Reminder: Today\'s Event', `Your event "${event.event}" is scheduled for ${reminderTime}.`);
                    console.log(`Reminder sent to ${user.email} for event: "${event.event}"`);
                } catch (emailError) {
                    console.error(`Error sending email to ${user.email}:`, emailError);
                }
            } else {
                console.log(`No email found for user ${event.userId}`);
            }
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
});

module.exports = {
    signup,
    login,
    logout,
    sendVerificationCode,
    verifyVerificationCode,
    createSchedule,
    getUserSchedule,
};
