const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User ', 
    },
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
module.exports = Schedule;