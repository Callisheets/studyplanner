import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './homepage/home.jsx';
import LoginPage from './login/login.jsx';
import SignupPage from './login/signup.jsx';
import CalendarPage from './calendar/calendar.jsx';
import Files from './files/files.jsx';
import Flashcards from './flashcards/flashcards.jsx';
import Schedule from './schedule/schedule.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/files" element={<Files />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/schedule" element={<Schedule />} />
            </Routes>
        </Router>
    );
}

export default App;