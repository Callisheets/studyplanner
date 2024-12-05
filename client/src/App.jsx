import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './homepage/home';
import LoginPage from './login/login';
import SignupPage from './login/signup';
import VerifyCodePage from './login/VerificationCodePage';
import CalendarPage from './calendar/calendar';
import Projects from './projects/projects'
import Schedule from './schedule/schedule';
import Notes from './notes/notes'
import Tasks from './task/tasks'
import ProtectedRoute from './protectedRoute'; // Import the ProtectedRoute component

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify" element={<VerifyCodePage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/notes" element={<Notes />} /> {/* Ensure this is correct */}
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/schedule" element={<Schedule />} />

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
                        path="/projects" 
                        element={
                            
                                <Projects />
                           
                        } 
                    />

                    <Route 
                        path="/notes" 
                        element={
                            
                                <Notes />
                           
                        } 
                    />
                    <Route 
                        path="/tasks" 
                        element={
                           
                                <Tasks />
                           
                        } 
                    />
                    <Route 
                        path="/schedule" 
                        element={
                                <Schedule />
                        } 
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;