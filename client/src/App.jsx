// src/App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './homepage/home';
import LoginPage from './login/login';
import SignupPage from './login/signup';
import VerifyCodePage from './login/VerificationCodePage';
import CalendarPage from './calendar/calendar';
import Files from './files/files';
import Schedule from './schedule/schedule';
import Flashcard from './flashcard/flashcard';
import Tasks from './task/tasks';
import Profile from './profile/profile';
import ProtectedRoute from './protectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify" element={<VerifyCodePage />} />
                    <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
                    <Route path="/calendar" element={<ProtectedRoute element={<CalendarPage />} />} />
                    <Route path="/files" element={<ProtectedRoute element={<Files />} />} />
                    <Route path="/flashcard" element={<ProtectedRoute element={<Flashcard />} />} />
                    <Route path="/tasks" element={<ProtectedRoute element={<Tasks />} />} />
                    <Route path="/schedule" element={<ProtectedRoute element={<Schedule />} />} />
                    <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;