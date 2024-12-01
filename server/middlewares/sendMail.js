const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, // Your email address
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD // Your email password
    }
});

const sendMail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info);
        return info; // Return the info object
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

module.exports = {
    sendMail // Ensure sendMail is exported correctly
};