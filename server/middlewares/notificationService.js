require('dotenv').config();
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, 
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD 
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
        console.log(`Sending email to: ${to}`); 
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info); 
    } catch (error) {
        console.error('Error sending email:', error); 
        throw error; 
    }
};

module.exports = { sendMail };
