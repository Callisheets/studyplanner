const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS, 
        pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD 
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
        return info; 
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; 
    }
};

module.exports = {
    sendMail 
};