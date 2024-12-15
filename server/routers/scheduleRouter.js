const express = require('express');
const router = express.Router();
const { createSchedule, getUserSchedule } = require('../controllers/schedule'); 
const { verifyToken } = require('../middlewares/authMiddleware');
const Schedule = require('../models/scheduleModel'); 

// POST route to create a new schedule
router.post('/schedule', verifyToken, createSchedule);

// GET route to fetch user schedules
router.get('/schedule', verifyToken, getUserSchedule);

// DELETE route to remove an event by ID
router.delete('/schedule/:id', verifyToken, async (req, res) => {
    const { id } = req.params; 
    const userId = req.user.id; 

    try {
        // Find the event by ID and ensure it belongs to the current user
        const event = await Schedule.findOneAndDelete({ _id: id, userId });

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found or you do not have permission to delete it' 
            });
        }

        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting event', 
            details: error.message 
        });
    }
});

module.exports = router;
