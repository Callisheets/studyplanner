// src/protectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    console.log('Is Authenticated:', isAuthenticated);

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;