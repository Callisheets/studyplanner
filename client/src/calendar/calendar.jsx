import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './calendar.css';

const CalendarPage = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [currentDate, setCurrentDate] = useState(new Date());
    const [holidays, setHolidays] = useState([]);

    // Fetch holidays from an API
    const fetchHolidays = async () => {
        const year = currentDate.getFullYear();
        const country = 'PH'; // Change this to your desired country code
        const apiKey = 'Odfdue1khzY0UCKLWLol5sSzSH0E6WCE'; // Replace with your API key

        try {
            const response = await fetch(`https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`);
            const data = await response.json();
            if (data.response && data.response.holidays) {
                setHolidays(data.response.holidays);
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, [currentDate]); // Fetch holidays whenever the current date changes

    // Function to check if a date is a holiday and get the holiday name
    const getHolidayName = (day) => {
        const dayString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const holiday = holidays.find(holiday => holiday.date === dayString);
        return holiday ? holiday.name : null;
    };

    const generateCalendarDays = () => {
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const calendarDays = [];
    
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div className="day empty" key={`empty-${i}`}></div>);
        }
    
        for (let day = 1; day <= daysInMonth; day++) {
            const holidayName = getHolidayName(day);
            const dayClass = holidayName ? 'holiday' : '';
    
            calendarDays.push(
                <div
                    className={`date ${day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'current-day' : ''} ${dayClass}`}
                    key={day}
                    tabIndex="0"
                >
                    <div>{day}</div>  
                    {holidayName && (
                        <div className="holiday-name">{holidayName}</div>
                    )}
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
        /*ito yung html */
        <div className="calendar-container">
            <div className="calendar-header">
                <h2 className="month-year">{`${currentMonth} ${currentYear}`}</h2>
                <div className="month-selector">
                    <button className="arrow" onClick={handlePreviousMonth} aria-label="Previous Month">&#9664;</button>
                    <button className="arrow" onClick={handleNextMonth} aria-label="Next Month">&#9654;</button>
                </div>
 <Link to="/" className="home-button">🏠 Home</Link>
            </div>
            <div className="calendar-dates">
                <div className="header">
                    {daysOfWeek.map((day, index) => (
                        <div className="header-day" key={index}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="body">
                    {generateCalendarDays()}
                </div>
            </div>
            {}
            <div className="holidays-list">
    <h3>Holidays</h3>
    <ul>
        {holidays.map((holiday, index) => (
            <li key={index}>
                {holiday.name} - {holiday.date.iso} {}
            </li>
        ))}
    </ul>
</div>
        </div>
    );
};

export default CalendarPage;