const express = require('express');
const router = express.Router();
const Schedule = require('../models/scheduleModel');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST route to create a new schedule
router.post('/schedule', verifyToken, async (req, res) => {
    const { event, date, time } = req.body; 
    const userId = req.user.id; 

    // Validate input
    if (!event || !date || !time) {
        return res.status(400).json({ message: 'Event, date, and time are required.' });
    }

    try {
        const newSchedule = new Schedule({ event, date, time, userId });
        await newSchedule.save(); 
        res.status(201).json({ schedule: newSchedule }); 
    } catch (error) {
        console.error('Error creating schedule:', error); 
        res.status(500).json({ message: 'Error creating schedule', error: error.message }); // Respond with a more detailed error message
    }
});

// GET route to fetch upcoming schedules for a specific user
router.get('/schedule/upcoming', verifyToken, async (req, res) => {
    const userId = req.user.id; // Get the userId from the authenticated user
    const today = new Date();

    try {
        // Fetch schedules that are greater than today
        const upcomingSchedules = await Schedule.find({ userId, date: { $gte: today } });
        if (!upcomingSchedules.length) {
            return res.status(404).json({ message: 'No upcoming schedules found for this user.' });
        }
        res.status(200).json({ schedules: upcomingSchedules });
    } catch (error) {
        console.error('Error fetching upcoming schedules:', error);
        res.status(500).json({ error: 'Error fetching upcoming schedules', details: error.message });
    }
});

// GET route to fetch schedules for a specific user
router.get('/schedule', verifyToken, async (req, res) => {
    const userId = req.user.id; 

    try {
        // Fetch schedules based on userId
        const schedules = await Schedule.find({ userId });
        if (!schedules.length) {
            return res.status(404).json({ message: 'No schedules found for this user.' });
        }
        res.status(200).json({ schedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Error fetching schedules', details: error.message });
    }
});

// DELETE route to delete a schedule by ID
router.delete('/schedule/:id', verifyToken, async (req, res) => {
    const { id } = req.params; 
    const userId = req.user.id; 

    try {
        const schedule = await Schedule.findOneAndDelete({ _id: id, userId });
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found or you do not have permission to delete it.' });
        }
        res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ success: false, message: 'Error deleting schedule', details: error.message });
    }
});

module.exports = router;
