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
    time: { 
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ',
        required: true,
    },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;