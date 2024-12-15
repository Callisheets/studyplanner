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
import Schedule from './schedule/schedule';
import Flashcard from './flashcard/flashcard';
import Tasks from './task/tasks';
import Profile from './profile/profile';



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
                    <Route path="/files" element={<Files />} />
                    <Route path="/flashcard" element={<Flashcard />} /> {/* Ensure this is correct */}
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/profile" element={<Profile />} />
                  

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
                            
                                <Files />
                           
                        } 
                    />

                    <Route 
                        path="/flashcard" 
                        element={
                            
                                <Flashcard />
                           
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

                    <Route 
                        path="/profile" 
                        element={
                                <Profile />
                        } 
                    />

                    

                    
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;