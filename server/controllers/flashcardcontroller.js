// e:\Codes\studyplanner\server\controllers\flashcardcontroller.js
const Flashcard = require('../models/flashcardModel');

const createFlashcard = async (req, res) => {
    const { frontText, backText } = req.body;
    const userId = req.user.id; 

    if (!frontText || !backText) {
        return res.status(400).json({ success: false, message: 'Front text and back text are required' });
    }

    try {
        const newFlashcard = new Flashcard({ userId, frontText, backText });
        await newFlashcard.save();
        res.status(201).json({ success: true, flashcard: newFlashcard });
    } catch (error) {
        console.error('Error creating flashcard:', error);
        res.status(500).json({ success: false, message: 'Error creating flashcard' });
    }
};

const getFlashcards = async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ userId: req.user.id }); // Assuming you have a userId field
        res.status(200).json({ success: true, flashcards });
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        res.status(500).json({ success: false, message: 'Error fetching flashcards' });
    }
};

const handleDelete = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    try {
        const flashcard = await Flashcard.findByIdAndDelete(id); // Find and delete the flashcard
        if (!flashcard) {
            return res.status(404).json({ success: false, message: 'Flashcard not found' });
        }
        res.status(200).json({ success: true, message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        res.status(500).json({ success: false, message: 'Error deleting flashcard' });
    }
};

// Ensure both functions are exported
module.exports = {
    createFlashcard,
    getFlashcards,
    handleDelete,
};