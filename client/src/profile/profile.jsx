import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import './profile.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser  } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
    const { user, loading, setUser  } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                if (data.success) {
                    setFormData({
                        name: data.user.name || '',
                        phone: data.user.phone || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

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
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                setUser (data.user); 
                setFormData({
                    name: data.user.name || '',
                    phone: data.user.phone || ''
                });
                setIsEditing(false); 
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="user-profile">
            <h1 className="profile-header">
                <FontAwesomeIcon icon={faCircleUser } className="user-icon" />
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                ) : (
                    <span>{formData.name || 'User  Profile'}</span>
                )}
            </h1>
            <div className="profile-details">
                { isEditing ? (
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                    />
                ) : (
                    <span>{formData.phone || 'No phone number provided'}</span>
                )}
            </div>
            <button onClick={handleEditToggle}>
                {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && (
                <button onClick={handleSave}>
                    Save
                </button>
            )}
        </div>
    );
};

export default UserProfile;