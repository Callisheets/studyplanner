import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faBell, faCog, faHome, faCalendarAlt, faFolder, faBookOpen, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [activeSidebarItem, setActiveSidebarItem] = useState('home');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);  // Sidebar visibility state
    const navigate = useNavigate();

    const handleAddNote = () => {
        if (noteInput.trim()) {
            setNotes([...notes, noteInput]);
            setNoteInput('');
        }
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem('token');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const setActive = (element) => {
        // Remove active class from all sidebar items
        const items = document.querySelectorAll('.sidebar li');
        items.forEach(item => item.classList.remove('active'));

        // Add active class to the clicked item
        element.classList.add('active');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                navigate('/login');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleSidebarItemClick = (item) => {
        setActiveSidebarItem(item);
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(prevState => !prevState);  // Toggle sidebar visibility
    };

    return (
        <div className={`homepage ${isSidebarVisible ? 'sidebar-visible' : ''}`}>  {/* Toggle homepage padding */}
            <header className="topbar">
                <div className="left-icons">
                    <button className="hamburger" id="hamburger" onClick={toggleSidebar}>  {/* Toggle Sidebar */}
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <img src="logo.png" alt="Logo" className="logo-icon" />
                </div>
                <div className="search-container">
                    <button className="search-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <input type="text" className="search-bar" placeholder="Search..." />
                </div>
                <div className="right-icons">
                    <button className="notification-icon">
                        <FontAwesomeIcon icon={faBell} />
                    </button>
                    <button className="settings-icon">
                        <FontAwesomeIcon icon={faCog} />
                    </button>
                </div>
            </header>

            <nav className={`sidebar ${isSidebarVisible ? 'open' : 'closed'}`} id="sidebar">  {/* Conditional Class */}
                <ul>
                    <li id="home" className="active" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/homepage" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <span className="icon"><FontAwesomeIcon icon={faHome} /></span> Home
                        </a>
                    </li>
                    <li id="calendar" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/calendar" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <span className="icon"><FontAwesomeIcon icon={faCalendarAlt} /></span> Calendar
                        </a>
                    </li>
                    <li id="files" onClick={(e) => setActive(e.currentTarget)}>
                        <span className="icon"><FontAwesomeIcon icon={faFolder} /></span> Files
                    </li>
                    <li id="flashcards" onClick={(e) => setActive(e.currentTarget)}>
                        <span className="icon"><FontAwesomeIcon icon={faBookOpen} /></span> Flashcards
                    </li>
                    <li id="schedule" onClick={(e) => setActive(e.currentTarget)}>
                        <span className="icon"><FontAwesomeIcon icon={faCalendarCheck} /></span> Schedule
                    </li>
                </ul>
            </nav>
            <div className="notes-section">
                <div className="recent-notes">
                    <h3>Recent Notes</h3>
                    <div id="recentNotesContainer">
                        <ul id="notesList">
                            {notes.map((note, index) => (
                                <li key={index}>{note}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <h2>Put Notes Here</h2>
                <textarea
                    id="noteInput"
                    placeholder="Type your note here..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                />
                <button id="addNoteBtn" onClick={handleAddNote}>Add Note</button>
            </div>
        </div>
    );
};

export default HomePage;
