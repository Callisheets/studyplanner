const nodemailer = require('nodemailer');

// Set up the transporter with your email provider's configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, 
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD, 
    },
});

// Function to send an email
const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to, 
        subject, 
        text, 
    };

    try {
        console.log(`Attempting to send email to: ${to}`);
        const info = await transporter.sendMail(mailOptions); 
        console.log(`Email sent successfully:`, info.response); 
    } catch (error) {
        console.error(`Failed to send email to ${to}. Error:`, error.message);
        throw new Error('Email sending failed. Please check the configuration and try again.'); 
    }
};

module.exports = { sendMail };