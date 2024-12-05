import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './projects.css'; // Import your CSS file for styling

const Projects = () => {
    return (

        /*html dito sa div feel free na palitan wag lang tatangalin yung div para gumana*/

        <div>
        <h1>Projects Page</h1>
        <p>Manage your projects here.</p>
        <section>
            <h2>Your Projects</h2>
            <ul>
                <li>Project A</li>
                <li>Project B</li>
                <li>Project C</li>
            </ul>
        </section>
        <section>
            <h2>Add a New Project</h2>
            <input type="text" placeholder="Project name" />
            <button>Add Project</button>
        </section>
        <Link to="/" className="home-button">🏠 Home</Link> {/* Home button */}
    </div>
);
};

export default Projects;