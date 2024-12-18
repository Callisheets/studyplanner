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
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect to the home page if the user is already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        // Validate email and password
        if (!email || !password) {
            setError('Email and Password are required.');
            console.log('Email or password is missing.'); 
            return;
        }

        const payload = { email, password };
        console.log('Sending payload:', payload);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (response.ok) {
                login(data.token); 
                navigate('/'); 
            } else {
                setError(data.message || 'Invalid email or password.'); 
                alert(data.message || 'Invalid email or password.'); 
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError('An error occurred. Please try again later.'); 
            alert('An error occurred. Please try again later.'); 
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

           
            <div className="login-container">
              
                <div className="logo-container">
                    <img src={logo} alt="Logo" />
                </div>

               
                <h2>Log In</h2>

              
                {error && (
                    <p className="error" aria-live="polite">
                        {error}
                    </p>
                )}

               
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

               
                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;