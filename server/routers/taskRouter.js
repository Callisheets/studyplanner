// src/routers/taskRouter.js
const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel'); // Ensure you have a Task model
const { verifyToken } = require('../middlewares/authMiddleware')

// GET route to fetch tasks
router.get('/tasks', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }); // Assuming you have userId in your request
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// POST route to create a new task
router.post('/tasks', verifyToken, async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id; // Access userId from req.user

    if (!content) {
        return res.status(400).json({ message: 'Task content is required' });
    }

    try {
        const newTask = new Task({ content, userId });
        await newTask.save();
        res.status(201).json({ task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

// DELETE route to delete a task by ID
router.delete('/tasks/:id', verifyToken, async (req, res) => {
    const { id } = req.params; // Get the task ID from the request parameters
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, message: 'Error deleting task' });
    }
});

module.exports = router;