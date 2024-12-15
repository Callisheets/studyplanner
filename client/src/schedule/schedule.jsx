import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './schedule.css';

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [eventInput, setEventInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [timeInput, setTimeInput] = useState('');
    const token = localStorage.getItem('token'); // No need to store in state if it doesn't change
    const userId = localStorage.getItem('userId'); // Same here

    // Fetch user schedules from the server
    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/schedule', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(response.data.schedules || []);
        } catch (error) {
            console.error('Error fetching schedules:', error.response?.data || error.message);
            alert('Failed to fetch schedules. Please try again.');
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
        if (!eventInput.trim() || !dateInput || !timeInput) {
            return alert('Event name, date, and time are required.');
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/schedule',
                { event: eventInput, date: dateInput, time: timeInput, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEvents([...events, response.data.schedule]);
            setEventInput('');
            setDateInput('');
            setTimeInput('');
        } catch (error) {
            console.error('Error adding event:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Failed to add event. Please try again.');
        }
    };

    const handleRemoveEvent = async (eventId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/schedule/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setEvents(events.filter((event) => event._id !== eventId));
            } else {
                alert('Failed to delete the event. Please try again.');
            }
        } catch (error) {
            console.error('Error removing event:', error.response?.data || error.message);
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
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    required
                />
                <button type="submit">Add Event</button>
            </form>

            <div className="events-container">
                <h2>Your Scheduled Events</h2>
                {events.length > 0 ? (
                    <ul className="event-list">
                        {events.map((event) => (
                            <li key={event._id}>
                                <span>{event.event} - {new Date(event.date).toLocaleDateString()} at {event.time}</span>
                                <button
                                    onClick={() => handleRemoveEvent(event._id)}
                                    className="remove-button"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No scheduled events yet. Add one above!</p>
                )}
                <Link to="/" className="home-button">Back</Link>
            </div>
        </div>
    );
};

export default Schedule;
