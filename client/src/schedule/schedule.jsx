// src/schedule/Schedule.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios'; // Import axios for API calls
import './schedule.css'; // Import your CSS file for styling

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [eventInput, setEventInput] = useState('');
    const [dateInput, setDateInput] = useState('');

    // Fetch user schedules from the server
    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            const response = await axios.get('http://localhost:5000/api/schedule', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
    
            // Log the entire response to the console
            console.log('Fetched schedules:', response.data); // Log the entire response
    
            // Update the state with the fetched schedules
            setEvents(response.data.schedules); // Ensure this matches the structure of your API response
        } catch (error) {
            console.error('Error fetching schedules:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchSchedules(); // Fetch schedules when the component mounts
    }, []);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (eventInput.trim() && dateInput) {
            try {
                const token = localStorage.getItem('token'); // Get the token from local storage
                const userId = localStorage.getItem('userId'); // Get the userId from local storage
    
                const response = await axios.post('http://localhost:5000/api/schedule', {
                    event: eventInput,
                    date: dateInput,
                    userId: userId, // Include userId in the request
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the headers
                    },
                });
    
                // Handle successful response
                console.log('Event added successfully:', response.data);
                // Optionally, you can fetch schedules again to update the list
                fetchSchedules();
            } catch (error) {
                console.error('Error adding event:', error.response ? error.response.data : error.message);
                alert('An error occurred while adding the event. Please try again.');
            }
        } else {
            console.error('Event name and date are required.');
        }
    };

    const handleRemoveClick = (eventId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to log in to remove an event.');
            return;
        }
        handleRemoveEvent(eventId);
    };


    const handleRemoveEvent = async (eventId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found. Please log in again.');
        }

        const response = await axios.delete(`http://localhost:5000/api/schedule/${eventId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            setEvents(events.filter(event => event._id !== eventId)); // Remove the event from the state
        } else {
            console.error('Error removing event:', response.data.message);
            alert('Failed to delete the event. Please try again.');
        }
    } catch (error) {
        console.error('Error removing event:', error.response ? error.response.data : error.message);
        alert('Failed to delete the event. Please try again.');
    }
};


return (
    /*ito yung html */
        <div className="schedule-container">
        <h1>Schedule Page</h1>
        <form onSubmit={handleAddEvent} className="event-form">
            <input
                type="text"
                placeholder="Event Name"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                required
            />
            <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                required
            />
            <button type="submit">Add Event</button>
        </form>
        <h2>Your Scheduled Events</h2>
        <ul className="event-list">
            {events.map((event) => (
                <li key={event._id}>
                    {event.event} - {new Date(event.date).toLocaleDateString()}
                    <button onClick={() => handleRemoveEvent(event._id)} className="remove-button">
                        Remove
                    </button>
                </li>
            ))}
        </ul>
        <Link to="/" className="home-button">🏠 Home</Link>
    </div>
);
};

export default Schedule;