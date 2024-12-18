import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './verify.css';
import logo from '../images/LogoVerify.png';

const VerifyCodePage = () => {
    const [code, setCode] = useState(''); 
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // Function to handle verification code submission
    const handleVerifyCode = async (e) => {
        e.preventDefault(); 
        setMessage({ type: '', text: '' }); 

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
                const errorText = await response.text(); 
                console.error('Error response:', errorText);
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                alert('Verification successful! Redirecting to the login page.');
                setTimeout(() => navigate('/login'), 2000); 
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
                    onChange={(e) => setCode(e.target.value)} 
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
