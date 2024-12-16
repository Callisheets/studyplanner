const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser  } = require('../middlewares/authMiddleware'); 
const User = require('../models/userModel')
const authController = require('../controllers/authController');

router.post('/signup', authController.signup); 
router.post('/login', authController.login); 
router.post('/logout', authController.logout); 
router.patch('/send-verification-code', authController.sendVerificationCode);
router.patch('/verify-verification-code', authController.verifyVerificationCode);
router.get('/user', authenticateUser , async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email phone'); // Select the fields you want to return
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Error fetching user' });
    }
});



module.exports = router;