const cron = require('node-cron');
const Schedule = require('../models/scheduleModel');
const User = require('../models/userModel');
const { sendMail } = require('../middlewares/sendMail');

// Create a new schedule
const createSchedule = async (req, res) => {
    const { event, date, time } = req.body;
    const userId = req.user?.id; 

    // Validate input
    if (!event || !date || !time) {
        return res.status(400).json({ message: 'Event, date, and time are required.' });
    }

    try {
        // Parse and validate the date
        const scheduleDate = new Date(date + 'T' + time);
        if (isNaN(scheduleDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }

        const newSchedule = new Schedule({ event, date: scheduleDate, time, userId });
        await newSchedule.save();

        console.log(`Schedule created: ${newSchedule}`);

        // Fetch the user's email and send notification if email exists
        const user = await User.findById(userId);
        if (user?.email) {
            await sendMail(
                user.email,
                'New Schedule Created',
                `Your schedule for "${event}" on ${scheduleDate.toLocaleDateString()} at ${time} has been created.`
            );
        }

        res.status(201).json({ success: true, schedule: newSchedule });
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ message: 'Error creating schedule.', error: error.message });
    }
};

// Get schedules for the authenticated user
const getUserSchedule = async (req, res) => {
    const userId = req.user?.id;

    try {
        // Fetch all schedules for the authenticated user, sorted by date and time
        const schedules = await Schedule.find({ userId }).sort({ date: 1, time: 1 });

        if (!schedules.length) {
            return res.status(404).json({ success: false, message: 'No schedules found.' });
        }

        res.status(200).json({ success: true, schedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ success: false, message: 'Error fetching schedules.', error: error.message });
    }
};

module.exports = {
    createSchedule,
    getUserSchedule,
};
