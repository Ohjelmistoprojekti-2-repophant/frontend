import { useState, useEffect } from 'react';
import './App.css';

const apiUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from the API and set the projects state
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Create a new project and add it to the projects state and the API
  const createProject = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      const data = await response.json();
      setProjects([...projects, data]);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  // Delete a project from the projects state and the API
  const deleteProject = async (id) => {
    try {
      await fetch(`${apiUrl}/api/projects/${id}`, {
        method: 'DELETE',
      });
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Update the newProject state when the input values change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  return (
    <div>
      <h1>Projects</h1>
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              {project.name} - {project.description}
              <button onClick={() => deleteProject(project.id)}>Delete</button>
            </li>
          ))}
        </ul>
      <h2>Create Project</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newProject.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={newProject.description}
        onChange={handleInputChange}
      />
      <button onClick={createProject}>Create</button>
    </div>
  );
};

export default App;