import { useState, useEffect } from 'react';
import { Stack, CssBaseline, Container, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import GithubRepoFetcher from './GithubRepoFetcher';

const apiUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editProject, setEditProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const setProjectDetails = (projectDetails) => {
    setNewProject(projectDetails);
  };

  const handleEditClick = (project) => {
    setEditProject(project);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditProject(null);
  };

  const handleEditChange = (e) => {
    setEditProject({ ...editProject, [e.target.name]: e.target.value });
  };

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
  
  

  return (
    <Container maxWidth={false} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
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
          <Button variant="contained" onClick={createProject}>Create</Button>
        </Stack>
        <GithubRepoFetcher setProjectDetails={setProjectDetails} />
      </Box>

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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h4">Project List</Typography>
        <ul>
          {filteredProjects.map(project => (
            <li key={project.id}>
              {project.name} - {project.description}
              <Button variant="outlined" color="primary" size="small" onClick={() => handleEditClick(project)}>Edit</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => deleteProject(project.id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default App;
