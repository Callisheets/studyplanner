import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an Auth context
import './profile.css'; // Import your CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
    const { user, loading } = useAuth(); // Get user data and loading state from context
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        name: '' // Add name field here
    });

    useEffect(() => {
        console.log('User data:', user); // Log user data to check its structure
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                email: user.email || '',
                phone: user.phone || '',
                name: user.name || '' // Set name from user data
            });
        }
    }, [user]);

    const handleEditToggle = () => {
        setIsEditing(prev => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                console.log('User updated successfully:', data.user);
                setFormData({
                    displayName: data.user.displayName || '',
                    email: data.user.email || '',
                    phone: data.user.phone || '',
                    name: data.user.name || '' // Update name field
                });
                setIsEditing(false); // Exit edit mode after saving
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    return (
        <div className="user-profile">
            <h1 className="profile-header">
                <FontAwesomeIcon icon={faCircleUser} className="user-icon" />
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                ) : (
                    <span>{formData.name || 'User Profile'}</span> // Display user name or fallback text
                )}
            </h1>
            <div className="profile-details">
                {Object.entries(formData).map(([key, value]) => (
                    <div className="profile-field" key={key}>
                        <label>{key === 'displayName' ? 'Display Name' : key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        {isEditing ? (
                            <input
                                type={key === 'email' ? 'email' : 'text'}
                                name={key}
                                value={value}
                                onChange={handleChange}
                            />
                        ) : (
                            <span>{value}</span> // Display user information when not editing
                        )}
                    </div>
                ))}
            </div>
            <button className="edit-profile-button" onClick={isEditing ? handleSave : handleEditToggle}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
        </div>
    );
};

export default UserProfile;
