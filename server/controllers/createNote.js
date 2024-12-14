const Note = require('../models/noteModel');

// Function to create a new note
const createNote = async (req, res) => {
    const { userId, content } = req.body;

    // Validate input
    if (!userId || !content) {
        return res.status(400).json({ success: false, message: 'User ID and content are required' });
    }

    try {
        // Create a new note instance
        const newNote = new Note({ userId, content });

        // Save the note to the database
        await newNote.save();

        // Send success response
        res.status(201).json({ success: true, note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ success: false, message: 'Error creating note' });
    }
};

module.exports = {
    createNote,
};
