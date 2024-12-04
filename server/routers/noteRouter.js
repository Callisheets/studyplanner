const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel'); // Ensure this path is correct

// POST route to create a new note
router.post('/notes', async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ success: false, message: 'Content is required.' });
    }

    try {
        const newNote = new Note({
            content,
        });
        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ success: false, message: 'Error creating note' });
    }
});

// GET route to fetch all notes
router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find(); // Fetch all notes from the database
        res.status(200).json({ success: true, notes });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ success: false, message: 'Error fetching notes' });
    }
});

// DELETE route to delete a note by ID
router.delete('/notes/:id', async (req, res) => {
    const { id } = req.params; // Get the note ID from the URL parameters
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

module.exports = router; // Export the router