import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import './flashcard.css'; 

const Notes = () => {
    const [notes, setNotes] = useState([]); 
    const [noteInput, setNoteInput] = useState(''); 
    const [error, setError] = useState(''); 

    // Function to fetch notes from the database
    const fetchNotes = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await axios.get('http://localhost:5000/api/notes', {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            setNotes(response.data.notes); 
            alert('Notes fetched successfully!'); 
        } catch (error) {
            console.error('Error fetching notes:', error);
            setError('Failed to fetch notes. Please try again.'); 
            alert('Error fetching notes: ' + error.message);
        }
    };

    // Fetch notes when the component mounts
    useEffect(() => {
        fetchNotes();
    }, []);

    // Function to handle adding a new note
    const handleAddNote = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await axios.post('http://localhost:5000/api/notes', {
                content: noteInput,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotes([...notes, response.data.note]); 
            setNoteInput(''); 
            alert('Note added successfully!'); 
        } catch (error) {
            console.error('Error creating note:', error.response.data);
            setError('Failed to add note. Please try again.'); 
            alert('Error adding note: ' + error.response.data.message);
        }
    };

    // Function to handle deleting a note
    const handleDeleteNote = async (noteId) => {
        const token = localStorage.getItem('token'); 
        try {
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            // Update the notes state to remove the deleted note
            setNotes(notes.filter(note => note._id !== noteId));
            alert('Note deleted successfully!'); 
        } catch (error) {
            console.error('Error deleting note:', error.response.data);
            setError('Failed to delete note. Please try again.');
            alert('Error deleting note: ' + error.response.data.message); 
        }
    };

    return (
        <div>
            <h1>Notes Page</h1>
            <p>Here you can view and manage your notes.</p>
            {error && <p className="error">{error}</p>} {}
            <section>
                <h2>Your Notes</h2>
                <ul>
                    {notes.map((note) => (
                        <li key={note._id}>
                            <p>{note.content}</p>
                            <button onClick={() => handleDeleteNote(note._id)}>Delete</button> {}
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
            <Link to="/" className="home-button">🏠 Home</Link> {}
        </div>
    );
};

export default Notes;
