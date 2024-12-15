const nodemailer = require('nodemailer');

// Set up the transporter with your email provider's configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider (e.g., Gmail, Outlook)
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, // Email address from environment variables
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD // Email password or app password from environment variables
    },
});

// Function to send an email
const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, // Sender's email address
        to, // Recipient's email address
        subject, // Subject of the email
        text, // Text content of the email
    };

    try {
        console.log(`Attempting to send email to: ${to}`); // Log the recipient email
        const info = await transporter.sendMail(mailOptions); // Send the email
        console.log(`Email sent successfully:`, info.response); // Log success response
    } catch (error) {
        console.error(`Failed to send email to ${to}. Error:`, error.message); // Log the error
        throw new Error('Email sending failed. Please check the configuration and try again.'); // Throw a more descriptive error
    }
};

module.exports = { sendMail };
