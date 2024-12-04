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
            const response = await axios.get('http://localhost:5000/api/schedule'); // Adjust endpoint if needed
            setEvents(response.data.schedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    useEffect(() => {
        fetchSchedules(); // Fetch schedules when the component mounts
    }, []);

    const handleAddEvent = async (e) => {
        e.preventDefault();
        if (eventInput.trim() && dateInput) {
            try {
                const response = await axios.post('http://localhost:5000/api/schedule', {
                    event: eventInput,
                    date: dateInput,
                });
                console.log('Response:', response.data);
                setEvents([...events, response.data.schedule]); // Update the events state
                setEventInput(''); // Clear the event input
                setDateInput(''); // Clear the date input
            } catch (error) {
                console.error('Error adding event:', error.response ? error.response.data : error.message); // Log the error response
                alert('An error occurred while adding the event. Please try again.'); // Display a user-friendly error message
            }
        } else {
            console.error('Event name and date are required.'); // Log if inputs are empty
        }
    };

    const handleRemoveEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:5000/api/schedule/${eventId}`); // Adjust the endpoint as needed
            setEvents(events.filter(event => event._id !== eventId)); // Remove the event from the state
        } catch (error) {
            console.error('Error removing event:', error);
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
            <Link to="/" className="home-button">🏠 Home</Link> {/* Home Button */}
        </div>
    );
};

export default Schedule;