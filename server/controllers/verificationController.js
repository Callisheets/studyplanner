const User = require('../models/userModel'); 
const { sendMail } = require('../middlewares/sendMail');
const { hmacProcess } = require('../utils/hashing'); 

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser   = await User.findOne({ email });
        if (!existingUser  ) {
            return res.status(400).json({ success: false, message: 'User  not found!' });
        }

        if (existingUser .verified) {
            return res.status(400).json({ success: false, message: 'You are already verified!' });
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();
        const info = await sendMail(existingUser .email, 'Verification Code', `<h1>${codeValue}</h1>`);

        if (info && info.accepted && info.accepted.length > 0) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser .verificationCode = hashedCodeValue;
            existingUser .verificationCodeValidation = Date.now();
            await existingUser .save(); 

            console.log('Verification code sent and saved:', existingUser );
            return res.status(200).json({ success: true, message: 'Code sent!' });
        }

        return res.status(400).json({ success: false, message: 'Code sending failed!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};