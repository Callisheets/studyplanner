import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './verify.css';
import logo from '../images/LogoVerify.png';

const VerifyCodePage = () => {
    const [code, setCode] = useState(''); // State to hold the verification code
    const [message, setMessage] = useState({ type: '', text: '' }); // State for both success and error messages
    const navigate = useNavigate(); // Hook to navigate between routes

    // Function to handle verification code submission
    const handleVerifyCode = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setMessage({ type: '', text: '' }); // Clear previous messages

        if (!code) {
            setMessage({ type: 'error', text: 'Verification code is required.' });
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-verification-code', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ providedCode: code }),
            });
            
            if (!response.ok) {
                const errorText = await response.text(); // Get the response as text
                console.error('Error response:', errorText); // Log the error response
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                alert('Verification successful! Redirecting to the login page.');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login page
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            console.error('Verification error:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        }
    };

    return (
        <div className="verify-code-container">
            <div className="LOGO" id="LOGO">
                <img src={logo} alt="Logo" />
            </div>

            <form onSubmit={handleVerifyCode}>
                <h2>Verify Your Account</h2>
                <h4>Please enter your verification code to proceed.</h4>
                <input
                    type="text"
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)} // Update code state on input change
                    required
                />
                <button type="submit">Verify Code</button>
            </form>

            {message.text && (
                <p className={message.type === 'error' ? 'error' : 'success'}>{message.text}</p>
            )}
        </div>
    );
};

export default VerifyCodePage;
