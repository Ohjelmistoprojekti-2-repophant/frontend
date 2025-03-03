import { useState, useEffect } from 'react';
import { Stack, CssBaseline, Container, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import GithubRepoFetcher from './GithubRepoFetcher';
import { Masonry } from '@mui/lab';
import ScrollToTop from './ScrollToTop';

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * App component is the main component of the application.
 * It manages the state of projects and provides functionality to fetch, create, edit, and delete projects.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', repositoryLink: '', language: '' });
  const [editProject, setEditProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [isSorted, setIsSorted] = useState(false); // State to manage sorting

  /**
   * useEffect hook to fetch projects when the component mounts.
   */
  useEffect(() => {
    fetchProjects();
  }, []);

  /**
    * Fetch projects from the API and set the projects state.
    * Logs an error message if the fetch fails.
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
      setNewProject({ name: '', description: '', repositoryLink: '', language: '' });
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
    setNewProject({ ...projectDetails, repositoryLink: projectDetails.html_url });
  };

  /**
   * Opens the edit dialog and sets the selected project for editing.
   * @param {Object} project - The project to edit.
   */
  const handleEditClick = (project) => {
    setEditProject(project);
    setOpen(true);
  };

  /**
   * Closes the edit dialog and resets the editProject state.
   */
  const handleClose = () => {
    setOpen(false);
    setEditProject(null);
  };

  /**
   * Updates the editProject state when input values change in the edit dialog.
   */
  const handleEditChange = (e) => {
    setEditProject({ ...editProject, [e.target.name]: e.target.value });
  };

  /**
   * Saves the edited project by sending a PUT request to the API and updating the state.
   */
  const handleSave = async () => {
    try {
      await fetch(`${apiUrl}/api/projects/${editProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProject),
      });

      setProjects(projects.map(p => (p.id === editProject.id ? editProject : p)));
      handleClose();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProjects = projects.filter(project =>
    project.name && project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );  

  // Sorts projects if true
  const sortedProjects = isSorted
    ? filteredProjects.sort((a, b) => a.name.localeCompare(b.name))
    : filteredProjects;

  // Changes the sorting method
  const toggleSort = () => {
    setIsSorted(!isSorted);
  };

  return (
    <Container maxWidth={false} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <CssBaseline />
      <Box>
        <Typography variant="h2">Projects</Typography>
        <Typography variant="h5">Create new Project</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
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
          <TextField
            type="text"
            name="repositoryLink"
            placeholder="GitHub Repository URL"
            value={newProject.repositoryLink}
            onChange={handleInputChange}
          />
          <TextField
            type="text"
            name="language"
            placeholder="Language"
            value={newProject.language}
            onChange={handleInputChange}
          />
          <Button variant="contained" onClick={createProject}>Create</Button>
        </Stack>
        <GithubRepoFetcher setProjectDetails={setProjectDetails} />
      </Box>

      {/* Edit project modal */}
      <Box sx={{ mt: 3 }}>
        <TextField
          placeholder="Search Projects By Name"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            name="name"
            value={editProject?.name || ""}
            onChange={handleEditChange}
            margin="dense"
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={editProject?.description || ""}
            onChange={handleEditChange}
            margin="dense"
          />
          <TextField
            label="GitHub Repository URL"
            fullWidth
            name="repositoryLink"
            value={editProject?.repositoryLink || ""}
            onChange={handleEditChange}
            margin="dense"
          />
          <TextField
            label="Language"
            fullWidth
            name="language"
            value={editProject?.language || ""}
            onChange={handleEditChange}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Sorting button */}
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={toggleSort}>
          {isSorted ? "Sort By Default" : "Sort By Name"}
        </Button>
      </Box>

      <Box sx={{ mt: 5, width: '80%' }}>
        <Typography variant="h4">Project List</Typography>
        <Masonry columns={3} spacing={2}>
          {sortedProjects.map((project) => (
            <Box key={project.id} sx={{
              border: '1px solid #ddd',
              padding: 2,
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden', // Hide anything overflowing the container
              wordWrap: 'break-word' // Prevent long words from overflowing
            }}>
              <Typography variant="h6">{project.name}</Typography>
              <Typography variant="body2">{project.description}</Typography>
              <Typography variant="body2">URL: <a href={project.repositoryLink} target="_blank" rel="noopener noreferrer">{project.repositoryLink}</a></Typography>
              <Typography variant="body2">Language: {project.language}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="outlined" color="primary" size="small" onClick={() => handleEditClick(project)}>Edit</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => deleteProject(project.id)}>Delete</Button>
              </Stack>
            </Box>
          ))}
        </Masonry>
      </Box>
      <ScrollToTop />
    </Container>
  );
};

export default App;
