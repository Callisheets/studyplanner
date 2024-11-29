// src/login/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Import your CSS file for styling

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for error messages
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(null); // Reset error state

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); // Parse JSON response
            if (response.ok) {
                console.log('User  registered successfully:', data);
                // Redirect to login page after successful signup
                navigate('/login');
            } else {
                setError(data.message); // Set error message from response
                console.error('Signup failed:', data);
            }
        } catch (error) {
            setError('An error occurred during signup.'); // Set generic error message
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Signup</h2>
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
                <button type="submit">Signup</button>
            </form>
            <Link to="/login">Already have an account? Login</Link> {/* Link to Login */}
            <Link to="/">Back to Home</Link> {/* Link back to Home */}
        </div>
    );
};

export default SignupPage;