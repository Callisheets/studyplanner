import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './homepage/home';
import LoginPage from './login/login';
import SignupPage from './login/signup';
import VerifyCodePage from './login/VerificationCodePage';
import CalendarPage from './calendar/calendar';
import Files from './files/files';
import Flashcards from './flashcards/flashcards';
import Schedule from './schedule/schedule';
import ProtectedRoute from './protectedRoute'; // Import the ProtectedRoute component

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify" element={<VerifyCodePage />} />
                    {/* Protect the HomePage route */}
                    <Route 
                        path="/" 
                        element={
                                <HomePage />
                        } 
                    />
                    <Route 
                        path="/calendar" 
                        element={
                                <CalendarPage />

                        } 
                    />
                    <Route 
                        path="/files" 
                        element={
                            <ProtectedRoute>
                                <Files />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/flashcards" 
                        element={
                            <ProtectedRoute>
                                <Flashcards />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/schedule" 
                        element={
                            <ProtectedRoute>
                                <Schedule />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;