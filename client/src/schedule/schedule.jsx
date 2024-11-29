// src/schedule/Schedule.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './schedule.css'; // Import your CSS file for styling

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [eventInput, setEventInput] = useState('');
    const [dateInput, setDateInput] = useState('');

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (eventInput.trim() && dateInput) {
            setEvents([...events, { text: eventInput, date: dateInput }]);
            setEventInput('');
            setDateInput('');
        }
    };

    const handleRemoveEvent = (index) => {
        const newEvents = events.filter((_, eventIndex) => eventIndex !== index);
        setEvents(newEvents);
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
                {events.map((event, index) => (
                    <li key={index}>
                        {event.text} - {new Date(event.date).toLocaleDateString()}
                        <button onClick={() => handleRemoveEvent(index)} className="remove-button">
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