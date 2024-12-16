require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('body-parser');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter'); 
const noteRouter = require('./routers/noteRouter');
const scheduleRouter = require('./routers/scheduleRouter');
const taskRouter = require('./routers/taskRouter');
const flashcardRouter = require('./routers/flashcardRouter');
const userRouter = require('./routers/userRouter');
const { sendMail } = require('./middlewares/sendMail');
const cron = require('node-cron');
const Schedule = require('./models/scheduleModel');
const User = require('./models/userModel');

const app = express();

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true, 
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Route setup
app.use('/api', noteRouter);
app.use('/api', scheduleRouter);
app.use('/api', taskRouter);
app.use('/api', flashcardRouter);
app.use('/api', userRouter);
app.use('/api/auth', authRouter);

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
    
// Cron job to send reminders for upcoming events
cron.schedule('*/5 * * * *', async () => { // Check every 5 minutes
    console.log('Cron job executed at:', new Date());
    try {
        const now = new Date();
        const tenMinutesLater = new Date(now);
        tenMinutesLater.setMinutes(now.getMinutes() + 10); // Set the time to 10 minutes later

        // Find events scheduled to start within the next 10 minutes
        const events = await Schedule.find({
            date: { $gte: now, $lt: tenMinutesLater },
        });

        console.log(`Found ${events.length} upcoming events.`); // Log the number of events found

        for (const event of events) {
            const user = await User.findById(event.userId);
            if (user?.email) {
                await sendMail(
                    user.email,
                    'Upcoming Event Reminder',
                    `You have an upcoming event: "${event.event}" scheduled for ${event.date.toLocaleString()}.`
                );
                console.log(`Reminder sent to ${user.email} for event: "${event.event}"`);
            } else {
                console.log(`No email found for user ID: ${event.userId}`);
            }
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
});

// Start the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
