const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel');
const { verifyToken } = require('../middlewares/authMiddleware'); // Import the middleware

// Create a new note
router.post('/notes', verifyToken, async (req, res) => {
    const { content } = req.body;

    // Validate content
    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ success: false, message: 'Content is required and must be a valid string.' });
    }

    try {
        const newNote = new Note({
            content,
            user: req.user.id, // `req.user` is populated by `verifyToken`
        });

        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (error) {
        console.error('Error creating note:', error.message);
        res.status(500).json({ success: false, message: 'Error creating note.' });
    }
});

// Get all notes for the authenticated user
router.get('/notes', verifyToken, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 }); // Sort notes by most recent
        res.status(200).json({ success: true, notes });
    } catch (error) {
        console.error('Error fetching notes:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching notes.' });
    }
});

// Delete a note by ID
router.delete('/notes/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    // Validate note ID
    if (!id) {
        return res.status(400).json({ success: false, message: 'Note ID is required.' });
    }

    try {
        const deletedNote = await Note.findOneAndDelete({ _id: id, user: req.user.id }); // Ensure the note belongs to the user
        if (!deletedNote) {
            return res.status(404).json({ success: false, message: 'Note not found or you do not have permission to delete this note.' });
        }
        res.status(200).json({ success: true, message: 'Note deleted successfully.' });
    } catch (error) {
        console.error('Error deleting note:', error.message);
        res.status(500).json({ success: false, message: 'Error deleting note.' });
    }
});

module.exports = router;
