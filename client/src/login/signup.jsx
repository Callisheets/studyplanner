import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import img from '../images/login.jpg';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault();
        const email = e.target.email.value; // Get email from the form

        // Send signup request
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password: e.target.password.value }), // Include password
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('email', email); // Store email for verification

                // Send verification code
                const verificationResponse = await fetch('http://localhost:5000/api/auth/send-verification-code', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }), // Send email for verification
                });

                const verificationData = await verificationResponse.json();
                if (verificationData.success) {
                    setSuccess('A verification code has been sent to your email.'); // Set success message
                    navigate('/verify'); // Redirect to verification page
                } else {
                    setError(verificationData.message); // Set error message for verification
                }
            } else {
                setError(data.message); // Set error message for signup
            }
        } catch (err) {
            setError('An error occurred. Please try again.'); // Handle any errors
        }
    };

    return (
        
        <div className="container">
            <div className="image-container">
                <img src={img} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="signup-container">
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSignup}>
                    <input
                        type="email"
                        name="email" // Added name attribute for form submission
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <input
                        type="password"
                        name="password" // Added name attribute for form submission
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default SignupPage;