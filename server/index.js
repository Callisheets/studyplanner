const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 5000;

// Use CORS middleware with specific origin
app.use(cors({
    origin: 'http://localhost:3000' // Allow only this origin
}));

app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// API endpoint for testing
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

// Other routes...

// The "catchall" handler
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});