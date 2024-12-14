import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import './schedule.css'; 

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [eventInput, setEventInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [timeInput, setTimeInput] = useState(''); // State for time input
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(localStorage.getItem('userId')); // Corrected line

    // Fetch user schedules from the server
    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/schedule', {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            console.log('Fetched schedules:', response.data);
            setEvents(response.data.schedules); 
        } catch (error) {
            console.error('Error fetching schedules:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchSchedules(); 
        } else {
            alert('You need to log in to view your schedules.');
        }
    }, [token]);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        console.log('Event:', eventInput); // Debugging: Check event input
        console.log('Date:', dateInput); // Debugging: Check date input
        console.log('Time:', timeInput); // Debugging: Check time input
    
        if (eventInput.trim() && dateInput && timeInput) { // Check for time input
            try {
                const response = await axios.post('http://localhost:5000/api/schedule', {
                    event: eventInput,
                    date: dateInput,
                    time: timeInput, // Include time in the request
                    userId: userId,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                console.log('Event added successfully:', response.data);
                fetchSchedules();
                // Clear inputs after adding the event
                setEventInput('');
                setDateInput('');
                setTimeInput('');
            } catch (error) {
                // Log the full error object for debugging
                console.error('Error adding event:', error); // Log the entire error object
                if (error.response) {
                    console.error('Error response data:', error.response.data); // Log the response data
                    alert(`Error adding event: ${error.response.data.message || 'An error occurred.'}`);
                } else {
                    alert('An error occurred while adding the event. Please try again.');
                }
            }
        } else {
            alert('Event name, date, and time are required.');
        }
    };

    const handleRemoveEvent = async (eventId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/schedule/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setEvents(events.filter((event) => event._id !== eventId)); 
            } else {
                alert('Failed to delete the event. Please try again.');
            }
        } catch (error) {
            console.error('Error removing event:', error.response ? error.response.data : error.message);
            alert('Failed to delete the event. Please try again.');
        }
    };

    return (
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
                <input
                    type="time" // Add time input
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    required
                />
                <button type="submit">Add Event</button>
            </form>
            
            <h2>Your Scheduled Events</h2>
            <ul className="event-list">
                {events.map((event) => (
                    <li key={event._id}>
                        {event.event} - {new Date(event.date).toLocaleDateString()} at {event.time} {/* Display time */}
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
