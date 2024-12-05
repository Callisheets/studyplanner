// src/notes/notes.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls
import './notes.css'; // Import your CSS file for styling

const Notes = () => {
    const [notes, setNotes] = useState([]); // State to hold notes
    const [noteInput, setNoteInput] = useState(''); // State for new note input
    const [error, setError] = useState(''); // State for error messages

    // Function to fetch notes from the database
    const fetchNotes = async () => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            const response = await axios.get('http://localhost:5000/api/notes', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            setNotes(response.data.notes); // Set the notes state with the fetched notes
        } catch (error) {
            console.error('Error fetching notes:', error);
            setError('Failed to fetch notes. Please try again.'); // Set error message
        }
    };

    // Fetch notes when the component mounts
    useEffect(() => {
        fetchNotes();
    }, []);

    // Function to handle adding a new note
    const handleAddNote = async () => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            const response = await axios.post('http://localhost:5000/api/notes', {
                content: noteInput,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            setNotes([...notes, response.data.note]); // Update notes state with the new note
            setNoteInput(''); // Clear the input field
        } catch (error) {
            console.error('Error creating note:', error.response.data);
            setError('Failed to add note. Please try again.'); // Set error message
        }
    };

    // Function to handle deleting a note
    const handleDeleteNote = async (noteId) => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        try {
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            // Update the notes state to remove the deleted note
            setNotes(notes.filter(note => note._id !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error.response.data);
            setError('Failed to delete note. Please try again.'); // Set error message
        }
    };



    return (
        /*html dito */
        <div>
            <h1>Notes Page</h1>
            <p>Here you can view and manage your notes.</p>
            {error && <p className="error">{error}</p>} {/* Display error message if any */}
            <section>
                <h2>Your Notes</h2>
                <ul>
                    {notes.map((note) => (
                        <li key={note._id}>
                            <p>{note.content}</p>
                            <button onClick={() => handleDeleteNote(note._id)}>Delete</button> {/* Delete button */}
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Add a New Note</h2>
                <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Write your note here..."
                ></textarea>
                <button onClick={handleAddNote}>Add Note</button>
            </section>
            <Link to="/" className="home-button">🏠 Home</Link> {/* Home button */}
        </div>
    );
};

export default Notes;