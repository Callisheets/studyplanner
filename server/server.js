// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter'); // Import your authentication routes

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Routes
app.use('/api/auth', authRouter); // Use the authRouter for authentication routes

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Start the server
const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});