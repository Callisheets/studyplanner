const mongoose = require('mongoose');

const flashcardSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', 
        required: true,
    },
    frontText: {
        type: String,
        required: true,
    },
    backText: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Flashcard', flashcardSchema);