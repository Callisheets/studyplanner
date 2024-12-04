const express = require('express');
const router = express.Router();
const Schedule = require('../models/scheduleModel')
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware')

// POST route to create a new schedule
router.post('/schedule', verifyToken, async (req, res) => {
    const { event, date } = req.body;
    const userId = req.user.id; // Get the userId from the authenticated user

    // Validate input
    if (!event || !date || !userId) {
        return res.status(400).json({ message: 'Event, date, and userId are required.' });
    }

    try {
        const newSchedule = new Schedule({ event, date, userId }); // Create a new schedule with userId
        await newSchedule.save(); // Save the schedule to the database
        res.status(201).json({ schedule: newSchedule }); // Respond with the created schedule
    } catch (error) {
        console.error('Error creating schedule:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error creating schedule', error }); // Respond with an error message
    }
});

// GET route to fetch schedules for a specific user
router.get('/schedule', verifyToken, async (req, res) => {
    const userId = req.user.id; // Assuming you have set req.user in your authentication middleware
    try {
        const schedules = await Schedule.find({ userId });
        res.status(200).json({ schedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Error fetching schedules' });
    }
});

// DELETE route to delete a schedule by ID
router.delete('/schedule/:id', verifyToken, async (req, res) => {
    const { id } = req.params; // Get the schedule ID from the request parameters
    const userId = req.user.id; // Get the user ID from the authenticated user

    try {
        // Find and delete the schedule that matches the ID and belongs to the user
        const schedule = await Schedule.findOneAndDelete({ _id: id, userId });
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found or you do not have permission to delete it.' });
        }
        res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ success: false, message: 'Error deleting schedule' });
    }
});

module.exports = router;