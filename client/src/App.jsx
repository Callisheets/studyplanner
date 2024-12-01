// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './homepage/home';
import LoginPage from './login/login';
import SignupPage from './login/signup';
import VerifyCodePage from './login/VerificationCodePage'; // Import the VerifyCodePage
import CalendarPage from './calendar/calendar'; // Import the CalendarPage
import Files from './files/files'; // Import the Files component
import Flashcards from './flashcards/flashcards'; // Import the Flashcards component
import Schedule from './schedule/schedule'; // Import the Schedule component

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify" element={<VerifyCodePage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/files" element={<Files />} /> {/* Route for Files */}
                    <Route path="/flashcards" element={<Flashcards />} /> {/* Route for Flashcards */}
                    <Route path="/schedule" element={<Schedule />} /> {/* Route for Schedule */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;