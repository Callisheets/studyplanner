const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const { verifyToken } = require('../middlewares/authMiddleware');

// GET route to fetch tasks
router.get('/tasks', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        if (!tasks.length) {
            return res.status(404).json({ success: false, message: 'No tasks found for this user' });
        }
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Error fetching tasks', details: error.message });
    }
});

// POST route to create a new task
router.post('/tasks', verifyToken, async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
        return res.status(400).json({ success: false, message: 'Task content is required' });
    }

    try {
        const newTask = new Task({ content, userId });
        await newTask.save();
        res.status(201).json({ success: true, task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: 'Error creating task', details: error.message });
    }
});

// DELETE route to delete a task by ID
router.delete('/tasks/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Find the task by ID and check if it belongs to the current user
        const task = await Task.findOneAndDelete({ _id: id, userId });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found or you do not have permission to delete it' });
        }
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, message: 'Error deleting task', details: error.message });
    }
});

module.exports = router;
