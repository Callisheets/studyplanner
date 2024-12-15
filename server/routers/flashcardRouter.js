// e:\Codes\studyplanner\server\routers\flashcardRouter.js
const express = require('express');
const router = express.Router();
const { createFlashcard, getFlashcards, handleDelete } = require('../controllers/flashcardcontroller'); 
const { verifyToken } = require('../middlewares/authMiddleware'); 

// POST route to create a new flashcard
router.post('/flashcards', verifyToken, createFlashcard);

// GET route to fetch all flashcards for the authenticated user
router.get('/flashcards', verifyToken, getFlashcards); 

router.delete('/flashcards/:id', verifyToken, handleDelete);

module.exports = router;