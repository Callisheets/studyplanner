// src/task/tasks.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls
import './tasks.css'; // Import your CSS file for styling

const Tasks = () => {
    const [tasks, setTasks] = useState([]); // State to hold tasks
    const [taskInput, setTaskInput] = useState(''); // State for new task input

    const [error, setError] = useState(''); // State for error messages

    // Function to fetch tasks from the server
    const fetchTasks = async () => {
        const token = localStorage.getItem('token'); // Get the token from local storage
        if (!token) {
            setError('You need to be logged in to view tasks.');
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Error fetching tasks. Please try again later.');
        }
    };

    // Function to handle adding a new task
    const handleAddTask = async () => {
        if (!taskInput) {
            setError('Task content is required');
            return;
        }
    
        const token = localStorage.getItem('token'); // Get the token from local storage
    
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', 
                { content: taskInput },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the headers
                    },
                }
            );
            setTasks([...tasks, response.data.task]);
            setTaskInput('');
        } catch (error) {
            console.error('Error creating task:', error);
            setError('Error creating task. Please try again later.');
        }
    };


    const handleDeleteTask = async (taskId) => {
        console.log('Deleting task with ID:', taskId); // Log the task ID
        const token = localStorage.getItem('token'); // Get the token from local storage
    
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                },
            });
            // Update the tasks state to remove the deleted task
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Error deleting task. Please try again later.');
        }
    };


    

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the component mounts
    }, []);



    return (
        /*html dito*/
        <div className="tasks-container">
            <h1>Tasks</h1>
            {error && <p className="error-message">{error}</p>}
            <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={handleAddTask}>Add Task</button>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.content}
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button> {/* Delete button */}
                    </li>
                ))}
            </ul>
            <Link to="/" className="home-button">🏠 Home</Link> {/* Home button */}
        </div>
    );
};

export default Tasks;