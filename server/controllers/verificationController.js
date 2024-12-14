const User = require('../models/userModel'); 
const { sendMail } = require('../middlewares/sendMail');
const { hmacProcess } = require('../utils/hashing'); 

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    // Validate email input
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required!' });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found!' });
        }

        // Check if user is already verified
        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: 'User is already verified!' });
        }

        // Generate verification code
        const codeValue = Math.floor(100000 + Math.random() * 900000).toString(); // Ensure 6-digit code

        // Send verification email
        const info = await sendMail(existingUser.email, 'Verification Code', `<h1>${codeValue}</h1>`);

        // Check if email was sent successfully
        if (info && info.accepted && info.accepted.length > 0) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save(); 

            console.log('Verification code sent and saved:', existingUser);
            return res.status(200).json({ success: true, message: 'Verification code sent successfully!' });
        }

        return res.status(500).json({ success: false, message: 'Failed to send verification code!' });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ success: false, message: 'An error occurred while sending the verification code.' });
    }
};
