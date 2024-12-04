// e:\Codes\studyplanner\server\routers\scheduleRouter.js
const express = require('express');
const { createSchedule } = require('../controllers/authController'); // Adjust the path as necessary
const router = express.Router();

router.post('/schedules', createSchedule);

module.exports = router;