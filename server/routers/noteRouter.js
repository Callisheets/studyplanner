const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel');
const { verifyToken } = require('../middlewares/authMiddleware'); // Import the middleware

// Create a new note (protected route)
router.post('/notes', verifyToken, async (req, res) => {
    const { content } = req.body;

    // Validate content
    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ success: false, message: 'Content is required and must be a valid string.' });
    }

    try {
        const newNote = new Note({
            content,
            user: req.user.id,
        });

        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (error) {
        console.error('Error creating note:', error.message);
        res.status(500).json({ success: false, message: 'Error creating note.' });
    }
});

// Get all notes for the authenticated user (protected route)
router.get('/notes', verifyToken, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notes });
    } catch (error) {
        console.error('Error fetching notes:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching notes.' });
    }
});

router.delete('/notes/:id', verifyToken, async (req, res) => {
    const { id } = req.params; 
    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        res.status(200).json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ success: false, message: 'Error deleting note', details: error.message });
    }
});

// Export the router
module.exports = router;