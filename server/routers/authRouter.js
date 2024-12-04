const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 


router.post('/signup', authController.signup); 
router.post('/login', (req, res) => {
    authController.login(req, res);
    console.log('logged in success') 
}); 
router.post('/logout', authController.logout); 
router.patch('/send-verification-code', authController.sendVerificationCode);
router.patch('/verify-verification-code', authController.verifyVerificationCode);

module.exports = router;