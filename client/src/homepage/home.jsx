import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSearch, faBell, faCog, faHome, faCalendarAlt, faFolder, faBookOpen, faCalendarCheck, faUser  } from '@fortawesome/free-solid-svg-icons'; // Import faUser 
import axios from 'axios';
import study from '../images/white.png';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [recentNotes, setRecentNotes] = useState([]); 
    const [error, setError] = useState('');
    const [activeSidebarItem, setActiveSidebarItem] = useState('home');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        if (!email || !password) {
            setError("Email and Password are required.");
            return;
        }
    
        const payload = { email, password };
    
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            console.log('Login response:', data);
    
            if (response.ok) { 
                setSuccess(data.message);
                localStorage.setItem('token', data.token);
                login(data.token); 
                navigate('/');
            } else {
                setError(data.message); 
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const fetchNotes = async () => {
        const token = localStorage.getItem('token'); 
        if (!token || isLoggingOut) {
            console.log('User  is not authenticated or is logging out. Skipping fetchNotes.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/notes', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(response.data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [isLoggingOut]);

    const handleAddNote = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/notes', {
                content: noteInput,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes([...notes, response.data.note]);
            setNoteInput('');

            // Update recent notes
            setRecentNotes(prevRecent => {
                const updatedRecent = [response.data.note, ...prevRecent];
                return updatedRecent.slice(0, 5); 
            });
        } catch (error) {
            console.error('Error creating note:', error.response ? error.response.data : error);
        }
    };

    const handleDelete = async (noteId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes(notes.filter(note => note._id !== noteId));
            setRecentNotes(recentNotes.filter(note => note._id !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error.response ? error.response.data : error);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
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
                setIsLoggedOut(true);
                logout();
                navigate('/login');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(prevState => !prevState);
    };

    return (
        <div className={`homepage ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-closed'}`}>
            <header className="topbar">
                <div className=" left-icons">
                    <button className="hamburger" id="hamburger" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <img src={study} alt="Study" style={{ width: '200px', height: '200px' }} />
                </div>
                <div className="search-container">
                    <input type="text" className="search-bar" placeholder="Search..." />
                </div>
                <div className="right-icons">
    <button className="button">
        <svg viewBox="0 0 448 512" className="bell">
            <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
        </svg>
    </button>
    <Link to="/profile" className="button">
        <FontAwesomeIcon icon={faUser } className="profile-icon" />
    </Link>
</div>
            </header>
            <nav className={`sidebar ${isSidebarVisible ? 'open' : 'closed'}`} id="sidebar">
                <ul>
                    <li id="home" className={`sidebar-item ${activeSidebarItem === 'home' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('home')}>
                        <Link to="/" className="sidebar-link">
                            <FontAwesomeIcon icon={faHome} className="sidebar-icon" /> Home
                        </Link>
                    </li>
                    <li id="schedule" className={`sidebar-item ${activeSidebarItem === 'schedule' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('schedule')}>
                        <Link to="/schedule" className="sidebar-link">
                            <FontAwesomeIcon icon={faCalendarCheck} className="sidebar-icon" /> Schedule
                        </Link>
                    </li>
                    
                    <li id="calendar" className={`sidebar-item ${activeSidebarItem === 'calendar' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('calendar')}>
                        <Link to="/calendar" className="sidebar-link">
                            <FontAwesomeIcon icon={faCalendarAlt} className="sidebar-icon" /> Calendar
                        </Link>
                    </li>
                    <li id="projects" className={`sidebar-item ${activeSidebarItem === 'projects' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('projects')}>
                        <Link to="/files" className="sidebar-link">
                            <FontAwesomeIcon icon={faFolder} className="sidebar-icon" /> Files
                        </Link>
                    </li>
                    <li id="notes" className={`sidebar-item ${activeSidebarItem === 'notes' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('notes')}>
                        <Link to="/flashcard" className="sidebar-link">
                            <FontAwesomeIcon icon={faBookOpen} className="sidebar-icon" /> Flash cards
                        </Link>
                    </li>
                    <li id ="tasks" className={`sidebar-item ${activeSidebarItem === 'tasks' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('tasks')}>
                        <Link to="/tasks" className="sidebar-link">
                            <FontAwesomeIcon icon={faCalendarCheck} className="sidebar-icon" /> Tasks
                        </Link>
                    </li>
                    <li className="sidebar-item" onClick={handleLogout}>
                        <a href="#" className="sidebar-link">
                            Logout
                        </a>
                    </li>
                </ul>
            </nav>

            <main className="content">
                <h1>Welcome to Your Dashboard</h1>

                <div className="notes-container">
                    <section className="recent-notes-section">
                        <h2>Recent Notes</h2>
                        <div className="recent-notes-container">
                            {recentNotes.map((note) => (
                                <div key={note._id} className="recent-note">
                                    <p>{note.content}</p>
                                    <button onClick={() => handleDelete(note._id)} className="delete-button">Delete</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="note-section">
                        <h2>Create a New Note</h2>
                        <textarea
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Write your note here..."
                            required
                        />
                        <button className="button2" onClick={handleAddNote}>Add Note</button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default HomePage;