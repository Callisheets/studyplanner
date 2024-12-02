import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Get authentication status from context

    // Log the authentication status
    console.log('Protected Route Check:', isAuthenticated()); 

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;