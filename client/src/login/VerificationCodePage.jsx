// src/components/VerifyCodePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyCodePage = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-verification-code', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, providedCode: code }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess(data.message); // Display success message
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after success
                }, 2000);
            } else {
                setError(data.message); // Display error message
            }
        } catch (err) {
            setError('An error occurred. Please try again.'); // Handle error
        }
    };

    return (
        <div className="verify-code-container">
            <h2>Verify Your Account</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleVerifyCode}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Verify Code</button>
            </form>
        </div>
    );
};

export default VerifyCodePage;