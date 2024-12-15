import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser  = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/user', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    console.log('API response:', data); // Log the API response
                    if (data.success) {
                        setUser (data.user); // Set the user data from the response
                    } else {
                        setUser (null); // Handle case where user is not found
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setUser (null);
                }
            } else {
                setUser (null); // No token means no user
            }
            setLoading(false); // Set loading to false after fetching
        };

        fetchUser (); // Call the fetchUser  function when the component mounts
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};