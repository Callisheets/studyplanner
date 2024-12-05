require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter'); 
const noteRouter = require('./routers/noteRouter')
const scheduleRouter = require ('./routers/scheduleRouter');
const taskRouter = require ('./routers/taskRouter')


const app = express();

app.use(cors());
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use('/api', noteRouter);
app.use('/api', scheduleRouter);
app.use('/api', taskRouter);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });


app.use('/api/auth', authRouter); 


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Start the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});