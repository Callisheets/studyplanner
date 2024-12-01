// src/components/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous error messages

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Send email and password in request body
            });

            const data = await response.json(); // Parse JSON response

            if (data.success) {
                navigate('/verify'); // Redirect to verification page on successful signup
            } else {
                setError(data.message); // Set error message from server response
            }
        } catch (err) {
            setError('An error occurred. Please try again.'); // Handle any errors during fetch
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>} {/* Display error message if exists */}
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                    required
                />
                <button type="submit">Sign Up</button> {/* Submit button for the form */}
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link> {/* Link to login page */}
            </p>
        </div>
    );
};

export default SignupPage; // Export the SignupPage component