const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authenticateUser  } = require('../middlewares/authMiddleware');

// PATCH route to update user information
router.patch('/user', verifyToken, async (req, res) => {
    const { name, phone } = req.body;
    const userId = req.user.id;

    try {
        const updatedUser  = await User.findByIdAndUpdate(userId, { name, phone }, { new: true });
        if (!updatedUser ) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }
        res.status(200).json({ success: true, user: updatedUser  });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
});

router.get('/user', authenticateUser , async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email phone');
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