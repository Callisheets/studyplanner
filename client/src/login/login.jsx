// src/login/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Import your CSS file for styling

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for error messages const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(null); // Reset error state

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); // Parse JSON response
            if (response.ok) {
                console.log('User  logged in successfully:', data);
                // Redirect to home page after successful login
                navigate('/');
            } else {
                setError(data.message); // Set error message from response
                console.error('Login failed:', data);
            }
        } catch (error) {
            setError('An error occurred during login.'); // Set generic error message
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <Link to="/signup">Don't have an account? Signup</Link> {/* Link to Signup */}
            <Link to="/">Back to Home</Link> {/* Link back to Home */}
        </div>
    );
};

export default LoginPage;