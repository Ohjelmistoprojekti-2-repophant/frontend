import { useState, useEffect } from 'react';
import { Stack, CssBaseline, Container, Typography, TextField, Button, Box } from '@mui/material';
import GithubRepoFetcher from './GithubRepoFetcher';

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * App component is the main component of the application.
 * It manages the state of projects and provides functionality to fetch, create, and delete projects.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });


  /**
   * useEffect hook to fetch projects when the component mounts.
   */
  useEffect(() => {
    fetchProjects();
  }, []);

  /**
    * Fetch projects from the API and set the projects state.
    * * Logs an error message if the fetch fails.
   */
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  /**
   * Creates a new project and adds it to the projects state and the API.
   * Logs an error message if the creation fails.
   */
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

  /**
   * Deletes a project from the projects state and the API.
   * Logs an error message if the deletion fails.
   */
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

  /**
   * Updates the newProject state when the input values change.
   *
   * @param {Object} event - The event object.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProject({ ...newProject, [name]: value });
  };

  /**
   * Sets the project details with the provided details.
   *
   * @param {Object} projectDetails - The project details.
   */
  const setProjectDetails = (projectDetails) => {
    setNewProject(projectDetails);
  };

  return (
    <Container maxWidth={false} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CssBaseline />
      <Box>
        <Typography variant="h2" sx={{ justifySelf: "center" }}>Projects</Typography>
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              {project.name} - {project.description}
              <button onClick={() => deleteProject(project.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <Typography variant="h5" sx={{ justifySelf: "center" }}>Create new Project</Typography>
        <Stack direction="row" spacing={2} sx={{ justifySelf: "center", mt: 3 }}>
          <TextField
            type="text"
            name="name"
            placeholder="Name"
            value={newProject.name}
            onChange={handleInputChange}
          />
          <TextField
            type="text"
            name="description"
            placeholder="Description"
            value={newProject.description}
            onChange={handleInputChange}
          />
          <Button variant="contained" onClick={createProject}>Create</Button>
        </Stack>
        <GithubRepoFetcher setProjectDetails={setProjectDetails} />
      </Box>
    </Container>
  );
};

export default App;