require('dotenv').config();
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, // Your email address
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD // Your email password or app password
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
        console.log(`Sending email to: ${to}`); // Log the recipient email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info); // Log the response from the email service
    } catch (error) {
        console.error('Error sending email:', error); // Log any errors
        throw error; // Rethrow the error for further handling
    }
};

module.exports = { sendMail };
