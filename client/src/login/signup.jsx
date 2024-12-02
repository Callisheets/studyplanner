import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css'
import img from '../images/login.jpg'

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault(); 
        setError(''); 
        setSuccess(''); 

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), 
            });

            const data = await response.json(); 

            if (data.success) {
                setSuccess(data.message); 
                localStorage.setItem('email', email); 
                navigate('/verify'); 
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
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>} {}
            {success && <p className="success">{success}</p>} {}
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p> {}
        </div>
    </div>
    );
};

export default SignupPage;