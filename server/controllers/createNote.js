const Note = require('../models/noteModel');

const createNote = async (req, res) => {
    const { userId, content } = req.body; 

    if (!userId || !content) {
        return res.status(400).json({ success: false, message: 'User  ID and content are required' });
    }

    try {
        const newNote = new Note({ userId, content });
        await newNote.save(); 
        res.status(201).json({ success: true, note: newNote }); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating note' });
    }
};

module.exports = {
    createNote,
};