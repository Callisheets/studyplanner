import React from 'react';
import { Link } from 'react-router-dom';
import './files.css'; 

const Projects = () => {
    return (


        <div className="projects-container">
        <h1>Files</h1>
        <p>Manage your files here.</p>
        <section>
            <h2>Your Files</h2>
            <ul>
                <li>Project A</li>
                <li>Project B</li>
                <li>Project C</li>
            </ul>
        </section>
        <section>
            <h2>Add a New Files</h2>
            <div class="input-container">
            <input type="text" placeholder="File name" class="project-input" />
            <button class="add-project-button">Add Files</button>
            </div>
        </section>
        <Link to="/" className="home-button">🏠 Home</Link> {}
    </div>
);
};

export default Projects;
