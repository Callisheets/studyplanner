// src/calendar/calendar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './calendar.css';

const CalendarPage = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [currentDate, setCurrentDate] = useState(new Date());

    const generateCalendarDays = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const calendarDays = [];

        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div className="day empty" key={`empty-${i}`}></div>);
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(
                <div className={`date ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'current-day' : ''}`} key={day} tabIndex="0">
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    return (
        <div className="datepicker">
            <div className="datepicker-top">
                <h1 className="month-name">{`${currentMonth} ${currentYear}`}</h1>
                <div className="month-selector">
                    <button className="arrow" onClick={handlePreviousMonth} aria-label="Previous Month">&#9664;</button>
                    <button className="arrow" onClick={handleNextMonth} aria-label="Next Month">&#9654;</button>
                </div>
                <Link to="/" className="home-button">🏠 Home</Link> {/* Add Home Button */}
            </div>
            <div className="datepicker-calendar">
                <div className="header">
                    {daysOfWeek.map((day, index) => (
                        <div className="day header-day" key={index}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="body">
                    {generateCalendarDays()}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;