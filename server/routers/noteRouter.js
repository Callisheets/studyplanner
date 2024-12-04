const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel');
const { verifyToken } = require('../middlewares/authMiddleware'); // Correctly import the middleware


router.post('/notes', verifyToken, async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required.' });
    }

    try {
        const newNote = new Note({
            content,
            user: req.user.id,
        });
        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ success: false, message: 'Error creating note' });
    }
});


router.get('/notes', verifyToken, async (req, res) => {
    try {
        const notes = await Note.find({ user : req.user.id });
        res.status(200).json({ success: true, notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, message: 'Error fetching notes' });
    }
});

router.delete('/notes/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ success: false, message: 'Note not found' });
        }
        res.status(200).json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ success: false, message: 'Error deleting note' });
    }
});

module.exports = router; 