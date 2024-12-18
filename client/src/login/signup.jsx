import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import img from '../images/login.jpg';
import logo from '../images/LogoVerify.png';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault();

        // Send signup request
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('email', email); 

                // Send verification code
                const verificationResponse = await fetch('http://localhost:5000/api/auth/send-verification-code', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }), 
                });

                const verificationData = await verificationResponse.json();
                if (verificationData.success) {
                    setSuccess('A verification code has been sent to your email.');
                    navigate('/verify'); 
                } else {
                    setError(verificationData.message); 
                }
            } else {
                setError(data.message); 
            }
        } catch (err) {
            setError('An error occurred. Please try again.'); 
        }
    };

    return (
        <div className="container">
            <div className="image-container">
                <img src={img} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="signup-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo"/>
                </div>
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        name="name" 
                        placeholder="Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                    <input
                        type="email"
                        name="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/login">Log In</Link></p>
            </div>
        </div>
    );
};

export default SignupPage;