import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './flashcard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faHome, faCalendarAlt, faFolder, faBookOpen, faCalendarCheck, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import study from '../images/white.png';
import { useAuth } from '../context/AuthContext';

const FlashCardComponent = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [frontText, setFrontText] = useState('');
    const [backText, setBackText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [flashcards, setFlashcards] = useState([]);

    // Flip card only when not editing
    const handleFlip = () => {
        if (!isEditing) {
            setIsFlipped(prevState => !prevState);
        }
    };

    const toggleEdit = (e) => {
        e.stopPropagation();
        setIsEditing(prevState => !prevState);
        if (isEditing) {
            setIsFlipped(false); 
        }
    };

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/flashcards', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setFlashcards(data.flashcards); 
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        };

        fetchFlashcards(); 
    }, []); 

    const handleSave = async (e) => {
        e.stopPropagation(); 
        try {
            const response = await fetch('http://localhost:5000/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ frontText, backText }),
            });

            const data = await response.json();
            if (data.success) {
                console.log("Flashcard saved:", data.flashcard);
                // Reset input fields and exit editing mode
                setFrontText('');
                setBackText('');
                setIsEditing(false);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error saving flashcard:', error);
        }
    };

    return (
        <div className="flashcard-container" onClick={handleFlip}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                <div className="front">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={frontText} 
                            onChange={(e) => setFrontText(e.target.value)} 
                            className="flashcard-input" 
                            placeholder="Enter question here" 
                        />
                    ) : (
                        <h2>{frontText || ""}</h2>
                    )}
                </div>
                <div className="back">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={backText} 
                            onChange={(e) => setBackText(e.target.value)} 
                            className="flashcard-input" 
                            placeholder="Enter answer here" 
                        />
                    ) : (
                        <h2>{backText || ""}</h2>
                    )}
                </div>
            </div>
            <button onClick={toggleEdit} className="edit-button">
                <FontAwesomeIcon icon={faPen} /> {/* Edit Icon */}
            </button>
            {isEditing && (
                <button onClick={handleSave} className="save-button">
                    <FontAwesomeIcon icon={faCheck} /> {/* Save Icon */}
                </button>
            )}
        </div>
    );
};

const FlashCard = () => {
    const [activeSidebarItem, setActiveSidebarItem] = useState('flashcards');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(prevState => !prevState);
    };

    return (
        <div className={`flashcard-page ${isSidebarVisible ? 'sidebar-visible' : 'sidebar-closed'}`}>
            <header className="topbar">
                <div className="left-icons">
                    <button className="hamburger" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <img src={study} alt="Study" style={{ width: '200px', height: '200px' }} />
                </div>
                <div className="search-container">
                    <input type="text" className="search-bar" placeholder="Search..." />
                </div>
                <button className="button">
                    <FontAwesomeIcon icon={faBell} className="bell" />
                </button>
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
                            <FontAwesomeIcon icon={faCalendarAlt} className="sidebar-icon" /> Schedule
                        </Link>
                    </li>
                    <li id="folder" className={`sidebar-item ${activeSidebarItem === 'folder' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('folder')}>
                        <Link to="/folder" className="sidebar-link">
                            <FontAwesomeIcon icon={faFolder} className="sidebar-icon" /> Folder
                        </Link>
                    </li>
                    <li id="resources" className={`sidebar-item ${activeSidebarItem === 'resources' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('resources')}>
                        <Link to="/resources" className="sidebar-link">
                            <FontAwesomeIcon icon={faBookOpen} className="sidebar-icon" /> Resources
                        </Link>
                    </li>
                    <li id="completed" className={`sidebar-item ${activeSidebarItem === 'completed' ? 'active' : ''}`} onClick={() => setActiveSidebarItem('completed')}>
                        <Link to="/completed" className="sidebar-link">
                            <FontAwesomeIcon icon={faCalendarCheck} className="sidebar-icon" /> Completed
                        </Link>
                    </li>
                </ul>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>
            <main className="content">
                <h1>Flashcards</h1>
                <FlashCardComponent />
            </main>
        </div>
    );
};

export default FlashCard;
