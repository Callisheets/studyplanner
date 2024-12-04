import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faBell, faCog, faHome, faCalendarAlt, faFolder, faBookOpen, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import study from '../images/study.jpg';

const HomePage = () => {
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('')
    const [activeSidebarItem, setActiveSidebarItem] = useState('home');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const navigate = useNavigate();

    // fetch ng notes sa database
    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in headers
                },
            });
            setNotes(response.data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes(); 
    }, []);


    //Add note funtion dito
    const handleAddNote = async () => {
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            console.log('Token:', token); // Log the token to check if it's retrieved
            const response = await axios.post('http://localhost:5000/api/notes', {
                content: noteInput,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            console.log('Note created:', response.data);
            setNotes([...notes, response.data.note]);
            setNoteInput('');
        } catch (error) {
            console.error('Error creating note:', error.response.data); // Log the response data
        }
    };

    //delete ng note
    const handleDelete = async (noteId) => {
        console.log('Deleting note with ID:', noteId); // Log the note ID
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            setNotes(notes.filter(note => note._id !== noteId)); // Update the notes state
        } catch (error) {
            console.error('Error deleting note:', error.response ? error.response.data : error);
        }
    };

    const setActive = (element) => {
        const items = document.querySelectorAll('.sidebar li');
        items.forEach(item => item.classList.remove('active'));
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
                localStorage.removeItem('token'); // Clear the token on explicit logout
                navigate('/login'); // Redirect to login page
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
        setIsSidebarVisible(prevState => !prevState);
    };

    return (
        <div className={`homepage ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
            <header className="topbar">
    <div className="left-icons">
        <button className="hamburger" id="hamburger" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
        </button>
        <img src={study} alt="Study" style={{ width: '60px', height: '60px' }} /> {/* Adjust size as needed */}
    </div>
    <div className="search-container">
        <input type="text" className="search-bar" placeholder="Search..." />
    </div>
    <div className="right-icons">
        <button className="notification-icon">
            <FontAwesomeIcon icon={faBell} />
        </button>
    </div>
</header>

            <nav className={`sidebar ${isSidebarVisible ? 'open' : 'closed'}`} id="sidebar">
                <ul>
                    <li id="home" className="active" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faHome} /> Home
                        </a>
                    </li>
                    <li id="schedule" className="active" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/schedule" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faHome} /> Schedule
                        </a>
                    </li>
                    <li id="calendar" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/calendar" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
                        </a>
                    </li>
                    <li id="projects" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/projects" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faFolder} /> Projects
                        </a>
                    </li>
                    <li id="notes" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/notes" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faBookOpen} /> Notes
                        </a>
                    </li>
                    <li id="tasks" onClick={(e) => setActive(e.currentTarget)}>
                        <a href="/tasks" style={{ textDecoration: 'none' }}>
                            <FontAwesomeIcon icon={faCalendarCheck} /> Tasks
                        </a>
                    </li>
                    <li onClick={handleLogout}>
                        <a href="#" style={{ textDecoration: 'none' }}>
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>

            <main className="content">
                <h1>Welcome to Your Dashboard</h1>

                <section className="note-section">
                    <h2>Create a New Note</h2>
                    <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Write your note here..."
                        required
                    />
                    <button onClick={handleAddNote}>Add Note</button>
                </section>

                <section className="notes-section">
                    <h2>Your Notes</h2>
                    <ul className="notes-list">
                        {notes.map((note) => (
                            <li key={note._id}>
                                <p>{note.content}</p>
                                <button className="delete-button" onClick={() => handleDelete(note._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
};
export default HomePage;