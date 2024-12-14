import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './verify.css'
import logo from '../images/LogoVerify.png'; 

const VerifyCodePage = () => {
    const [code, setCode] = useState(''); 
    const [error, setError] = useState(''); 
    const [success, setSuccess] = useState(''); 
    const navigate = useNavigate(); // Define navigate here

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem('email'); 

            const response = await fetch('http://localhost:5000/api/auth/verify-verification-code', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, providedCode: code }),
            });

            const data = await response.json();
            if (data.success) {
                setSuccess(data.message);
                alert('Verification successful! You will be redirected to the login page shortly.'); // Success alert
                setTimeout(() => {
                    navigate('/login'); // Use navigate here
                }, 2000);
            } else {
                setError(data.message); 
                alert('Error: ' + data.message); // Error alert
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            alert('An error occurred. Please try again.'); // Catch block alert
        }
    };

    return (
        /*ito yung html */
        <div className="verify-code-container">
            <div className="LOGO" id="LOGO">
                <img src={logo} alt="Logo" />
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleVerifyCode}>
                <h2>Verify Your Account</h2>
                <h4>Hello, new user, you should receive a verification code shortly. Please enter it to proceed.</h4>
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
