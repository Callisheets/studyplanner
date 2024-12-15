// e:\Codes\studyplanner\server\routers\userRouter.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path as necessary
const { verifyToken } = require('../middlewares/authMiddleware'); // Middleware to verify user token

// PATCH route to update user information
router.patch('/user', verifyToken, async (req, res) => {
    const { name, email, phone } = req.body; // Get data from request body

    try {
        const updatedUser  = await User.findByIdAndUpdate(
            req.user.id, // Get user ID from the token
            { name, email, phone },
            { new: true } // Return the updated user
        );

        if (!updatedUser ) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }

        res.status(200).json({ success: true, user: updatedUser  });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user' });
    }
});

module.exports = router;