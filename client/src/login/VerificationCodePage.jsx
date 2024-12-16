import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './verify.css';
import logo from '../images/LogoVerify.png'; 

const VerifyCodePage = () => {
    const [code, setCode] = useState(''); // State to hold the verification code
    const [error, setError] = useState(''); // State to hold error messages
    const [success, setSuccess] = useState(''); // State to hold success messages
    const navigate = useNavigate(); // Hook to navigate between routes

    // Function to handle verification code submission
    const handleVerifyCode = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(''); // Clear any previous error messages
        setSuccess(''); // Clear any previous success messages
    
        // Validate the input code
        if (!code) {
            console.log('Error: Verification code is empty');
            setError('Verification code is required.'); // Set error if code is empty
            return; // Exit the function if the code is empty
        }
    
        console.log('Verification code being sent:', code); // Debugging log
    
        try {
            // Send the verification code to the server
            const response = await fetch('http://localhost:5000/api/auth/verify-verification-code', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ providedCode: code }), // Send the provided code in the request body
            });
            const data = await response.json(); // Parse the JSON response
    
            if (data.success) {
                setSuccess(data.message); // Set success message
                alert('Verification successful! You will be redirected to the login page shortly.'); // Success alert
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after 2 seconds
                }, 2000);
            } else {
                setError(data.message); // Set error message
                alert('Error: ' + data.message); // Error alert
            }
        } catch (err) {
            console.error('Error during verification:', err); // Log the error for debugging
            setError('An error occurred. Please try again.'); // Set error message for catch block
            alert('An error occurred. Please try again.'); // Catch block alert
        }
    };

    const verifyCode = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-verification-code', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    providedCode: code, // Ensure this is the correct variable
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message); // Log error message from the backend
                setError(errorData.message); // Set error message to state
                return;
            }

            const data = await response.json();
            console.log('Success:', data);
            setSuccess(data.message); // Set success message to state
            alert('Verification successful! You will be redirected to the login page shortly.'); // Success alert
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after 2 seconds
            }, 2000);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('An error occurred. Please try again.'); // Set error message for catch block
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(''); // Clear any previous error messages
        setSuccess(''); // Clear any previous success messages

        // Validate the input code
        if (!code) {
            console.log('Error: Verification code is empty');
            setError('Verification code is required.'); // Set error if code is empty
            return; // Exit the function if the code is empty
        }

        // Call the verifyCode function
        verifyCode();
    };
    return (
        <div className="verify-code-container">
            <div className="LOGO" id="LOGO">
                <img src={logo} alt="Logo" />
            </div>

            <form onSubmit={handleSubmit}>
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

            {error && <p className="error">{error}</p>} {/* Display error message if exists */}
            {success && <p className="success">{success}</p>} {/* Display success message if exists */}
        </div>
    );
};

export default VerifyCodePage;