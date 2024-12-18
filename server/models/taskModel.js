// src/models/taskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', 
        required: true,
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;