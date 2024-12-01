const User = require('../models/userModel'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JWT for token generation
const { sendMail } = require('../middlewares/sendMail'); // Import the sendMail middleware
const { hmacProcess } = require('../utils/hashing'); // Import the hashing utility
const { acceptCodeSchema } = require('../middlewares/validator');

// Signup function
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ success: false, message: 'User  already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ email, password: hashedPassword });
        await newUser .save();

        res.status(201).json({ success: true, message: 'User  created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Login function
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ email: username }).select('+password');
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
        res.status(400).json({ success: false, message: error.message });
    }
};

// Logout function
exports.logout = (req, res) => {
    res.clearCookie('Authorization').status(200).json({ success: true, message: 'Logged out successfully' });
};

// Send Verification Code function
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser  = await User.findOne({ email });
        if (!existingUser ) {
            return res.status(400).json({ success: false, message: 'User  not found!' });
        }

        if (existingUser .verified) {
            return res.status(400).json({ success: false, message: 'You are already verified!' });
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();
        const info = await sendMail(existingUser .email, 'Verification Code', `<h1>${codeValue}</h1>`);

        if (info && info.accepted && info.accepted.length > 0) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser .verificationCode = hashedCodeValue; // Save the hashed code
            existingUser .verificationCodeValidation = Date.now(); // Save the current time
            await existingUser .save(); // Save the user object

            console.log('Verification code sent and saved:', existingUser ); // Debug log
            return res.status(200).json({ success: true, message: 'Code sent!' });
        }

        return res.status(400).json({ success: false, message: 'Code sending failed!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Verification Code function
exports.verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body;

    try {
        // Validate the input
        const { error, value } = acceptCodeSchema.validate({ email, providedCode });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        // Find the user
        const existingUser  = await User.findOne({ email }).select('+verificationCode +verificationCodeValidation');
        console.log('Fetched User:', existingUser ); // Log the user object for debugging

        if (!existingUser ) {
            return res.status(400).json({ success: false, message: 'User  does not exist!' });
        }

        // Check if user is already verified
        if (existingUser .verified) {
            return res.status(400).json({ success: false, message: 'You are already verified!' });
        }

        // Check if verification code and validation time are set
        if (!existingUser .verificationCode || !existingUser .verificationCodeValidation) {
            return res.status(400).json({ success: false, message: 'Verification code or validation time is missing.' });
        }

        // Check if the code has expired
        if (Date.now() - existingUser .verificationCodeValidation > 5 * 60 * 1000) {
            return res.status(400).json({ success: false, message: 'Code has expired!' });
        }

        // Convert providedCode to string before hashing
        const hashedCodeValue = hmacProcess(providedCode.toString(), process.env.HMAC_VERIFICATION_CODE_SECRET);

        // Compare the hashed code with the stored code
        if (hashedCodeValue === existingUser .verificationCode) {
            existingUser .verified = true; // Mark user as verified
            existingUser .verificationCodeValidation = undefined; // Clear validation field
            existingUser .verificationCode = undefined; // Clear verification code
            await existingUser .save(); // Save the updated user object

            return res.status(200).json({ success: true, message: 'Your account has been verified!' });
        }

        return res.status(400).json({ success: false, message: 'Invalid verification code!' });
    } catch (error) {
        console.error('Verification Error:', error); // Log the error details
        res.status(500).json({ success: false, message: 'An error occurred during verification.' });
    }
};