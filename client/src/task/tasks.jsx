import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import './tasks.css'; 

const Tasks = () => {
    const [tasks, setTasks] = useState([]); 
    const [taskInput, setTaskInput] = useState(''); 
    const [error, setError] = useState(''); 

    // Reference to the task list element
    const taskListRef = useRef(null);

    // Function to fetch tasks from the server
    const fetchTasks = async () => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            alert('You need to be logged in to view tasks.');
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            alert('Error fetching tasks. Please try again later.');
        }
    };

    // Function to handle adding a new task
    const handleAddTask = async () => {
        if (!taskInput) {
            alert('Task content is required');
            return;
        }

        const token = localStorage.getItem('token'); 
        if (!token) {
            setError('You need to be logged in to add tasks.');
            alert('You need to be logged in to add tasks.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/tasks', 
                { content: taskInput },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );
            setTasks([...tasks, response.data.task]);
            setTaskInput('');

            // Scroll to the newly added task
            if (taskListRef.current) {
                taskListRef.current.scrollTop = taskListRef.current.scrollHeight;
            }

        } catch (error) {
            console.error('Error creating task:', error);
            setError('Error creating task. Please try again later.');
            alert('Error creating task. Please try again later.');
        }
    };

    // Function to handle deleting a task
    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('You need to be logged in to delete tasks.');
            alert('You need to be logged in to delete tasks.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Error deleting task. Please try again later.');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="tasks-container">
            <Link to="/" className="home-button">🏠 Home</Link>
            <h1>Tasks</h1>
            {error && <p className="error-message">{error}</p>}
            <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a new task"
            />
            <button onClick={handleAddTask}>Add Task</button>
            <ul ref={taskListRef}>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.content}
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;