const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule; // Ensure this line is present