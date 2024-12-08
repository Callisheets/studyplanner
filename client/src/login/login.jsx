import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';
import img from '../images/login.jpg';
import { useAuth } from '../context/AuthContext';
import logo from '../images/LogoVerify.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        // Redirect to home if already authenticated
        if (isAuthenticated) {
            navigate('/'); // Redirect to home page
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        if (!email || !password) {
            setError("Email and Password are required.");
            return;
        }
    
        const payload = { email, password };
    
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            console.log('Login response:', data);
    
            if (response.ok) { 
                setSuccess(data.message);
                login(data.token); // Call the login function here
                navigate('/'); // Redirect to the home page after successful login
            } else {
                setError(data.message); 
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        /*ito yung html */
        <div className="container">
            <div className="image-container">
                <img src={img} alt="img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="login-container">
                <div className="logo-container">
                    <img src={logo} alt="Logo"/>
                </div>
                <h2>Log In</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;