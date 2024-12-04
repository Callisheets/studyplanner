const express = require('express');
const router = express.Router();
const Schedule = require('../models/scheduleModel')
const authController = require('../controllers/authController');

// POST route to create a new schedule
router.post('/schedule', async (req, res) => {
    const { event, date } = req.body;

    // Validate input
    if (!event || !date) {
        return res.status(400).json({ message: 'Event and date are required.' });
    }

    try {
        const newSchedule = new Schedule({ event, date }); // Create a new schedule
        await newSchedule.save(); // Save the schedule to the database
        res.status(201).json({ schedule: newSchedule }); // Respond with the created schedule
    } catch (error) {
        console.error('Error creating schedule:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error creating schedule', error }); // Respond with an error message
    }
});

// GET route to fetch schedules for a specific user
router.get('/schedule/:userId', authController.getUserSchedule);

// DELETE route to delete a schedule by ID
router.delete('/schedule/:id', authController.deleteSchedule);

module.exports = router;