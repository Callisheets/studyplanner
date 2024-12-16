import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css'; // Ensure this CSS file exists
import img from '../images/login.jpg'; // Ensure this image path is correct
import { useAuth } from '../context/AuthContext'; // Ensure this context exists
import logo from '../images/LogoVerify.png'; // Ensure this image path is correct

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect to the home page if the user is already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error messages

        // Validate email and password
        if (!email || !password) {
            setError('Email and Password are required.');
            console.log('Email or password is missing.'); // Log the error
            return;
        }

        const payload = { email, password };
        console.log('Sending payload:', payload); // Debugging log

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Server response:', data); // Debugging log

            if (response.ok) {
                login(data.token); // Authenticate user
                navigate('/'); // Redirect on success
            } else {
                setError(data.message || 'Invalid email or password.'); // Set error message
                alert(data.message || 'Invalid email or password.'); // Show alert with error message
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('An error occurred. Please try again later.'); // Set error message
            alert('An error occurred. Please try again later.'); // Show alert with error message
        }
    };

    return (
        <div className="container">
            {/* Image Section */}
            <div className="image-container">
                <img
                    src={img}
                    alt="Login illustration"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Login Section */}
            <div className="login-container">
                {/* Logo */}
                <div className="logo-container">
                    <img src={logo} alt="Logo" />
                </div>

                {/* Heading */}
                <h2>Log In</h2>

                {/* Error Message */}
                {error && (
                    <p className="error" aria-live="polite">
                        {error}
                    </p>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email"
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Password"
                    />

                    <button type="submit" aria-label="Log in">
                        Log in
                    </button>
                </form>

                {/* Redirect to Sign Up */}
                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;