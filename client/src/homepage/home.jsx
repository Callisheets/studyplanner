// src/homepage/home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import the CSS file

const HomePage = () => {
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [activeSidebarItem, setActiveSidebarItem] = useState('home');
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to manage sidebar visibility

    const handleAddTask = () => {
        if (taskInput.trim()) {
            setTasks([...tasks, taskInput.trim()]);
            setTaskInput('');
        }
    };

    const handleRemoveTask = (index) => {
        const newTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
        setTasks(newTasks);
    };

    const handleSidebarItemClick = (item) => {
        setActiveSidebarItem(item);
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
    };

    return (
        <div>
            <header className="topbar">
                <div className="left-icons">
                    <button className="hamburger" id="hamburger" onClick={toggleSidebar}>
                        &#9776;
                    </button>
                    <span className="icon rocket">🚀</span>
                </div>
                <div className="top-right">
                    <input type="text" className="search-bar" placeholder="Search..." />
                    <button className="icon">🔔</button>
                    <button className="icon">⚙️</button>
                </div>
            </header>

            <div className="container">
                {isSidebarVisible && ( // Render sidebar only if visible
                    <nav className="sidebar" id="sidebar">
                        <ul>
                            <li id="home" className={activeSidebarItem === 'home' ? 'active' : ''} onClick={() => handleSidebarItemClick('home')}>
                                <Link to="/">🏠 Home</Link>
                            </li>
                            <li id="calendar" className={activeSidebarItem === 'calendar' ? 'active' : ''} onClick={() => handleSidebarItemClick('calendar')}>
                                <Link to="/calendar">📅 Calendar</Link>
                            </li>
                            <li id="files" className={activeSidebarItem === 'files' ? 'active' : ''} onClick={() => handleSidebarItemClick('files')}>
                                <Link to="/files">📁 Files</Link>
                            </li>
                            <li id="flashcards" className={activeSidebarItem === 'flashcards' ? 'active' : ''} onClick={() => handleSidebarItemClick('flashcards')}>
                                <Link to="/flashcards">📖 Flashcards</Link>
                            </li>
                            <li id="schedule" className={activeSidebarItem === 'schedule' ? 'active' : ''} onClick={() => handleSidebarItemClick('schedule')}>
                                <Link to="/schedule">🗓️ Schedule</Link>
                            </li>
                        </ul>
                    </nav>
                )}

                <main className="content" id="content">
                    <div className="welcome">
                        <h1>Welcome to the Study Planner</h1>
                    </div>
                    <div className="tasks">
                        <h2>Your Tasks</h2>
                        <ul id="task-list">
                            {tasks.map((task, index) => (
                                <li key={index} className="task-item">
                                    <span>{task}</span>
                                    <button onClick={() => handleRemoveTask(index)}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            id="task-input"
                            placeholder="Add a new task..."
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                        />
                        <button id="add-task" onClick={handleAddTask}>Add Task</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomePage;