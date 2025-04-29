import { useState, useEffect, useMemo } from 'react';
import {
	Stack,
	CssBaseline,
	Container,
	Typography,
	TextField,
	Button,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	createTheme,
	ThemeProvider,
	FormControlLabel,
	FormControl,
	Select,
	InputLabel,
	Chip,
	Switch,
	MenuItem,
} from '@mui/material';
import ProjectCard from '../components/ProjectCard';
import GithubRepoFetcher from '../components/GithubRepoFetcher';
import GithubProfileAnalyzer from '../components/GithubProfileAnalyzer';
import { Masonry } from '@mui/lab';
import ScrollToTop from '../utils/ScrollToTop';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const App = () => {
	const [projects, setProjects] = useState([]);
	const [newProject, setNewProject] = useState({
		name: '',
		description: '',
		repositoryLink: '',
		language: '',
		createdAt: '',
		pushedAt: '',
	});
	const [editProject, setEditProject] = useState(null);
	const [open, setOpen] = useState(false);
	const [sortMode, setSortMode] = useState('default'); // State to manage sort mode
	const [languages, setLanguages] = useState([]);
	const [selectedLanguage, setSelectedLanguage] = useState('');
	const [mode, setMode] = useState('light');
	const [user, setUser] = useState({});

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
			setLanguages([...new Set(data.map((project) => project.language))]);
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
			setNewProject({
				name: '',
				description: '',
				repositoryLink: '',
				language: '',
				createdAt: '',
				pushedAt: '',
			});
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
			setProjects(projects.filter((project) => project.id !== id));
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
		setNewProject({
			...projectDetails,
			repositoryLink: projectDetails.html_url,
			createdAt: projectDetails.created_at,
			pushedAt: projectDetails.pushed_at,
		});
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

			setProjects(
				projects.map((p) => (p.id === editProject.id ? editProject : p))
			);
			handleClose();
		} catch (error) {
			console.error('Error updating project:', error);
		}
	};

	const handleSearchChange = (event) => {
		setSelectedLanguage(event.target.value);
	};

	const sortedProjects = useMemo(() => {
		return [...projects].sort((a, b) =>
			sortMode === 'name'
				? a.name.localeCompare(b.name)
				: sortMode === 'newest'
					? new Date(b.createdAt) - new Date(a.createdAt)
					: sortMode === 'oldest'
						? new Date(a.createdAt) - new Date(b.createdAt)
						: 0
		);
	}, [projects, sortMode]);

	// Filters the sorted projects based on the search query
	const filteredProjects = useMemo(() => {
		return sortedProjects.filter((project) =>
			selectedLanguage == ''
				? project.language
				: project.language == selectedLanguage
		);
	}, [sortedProjects, selectedLanguage]);

	// Changes the sorting method
	const toggleSort = () => {
		setSortMode(
			sortMode === 'default'
				? 'name'
				: sortMode === 'name'
					? 'newest'
					: sortMode === 'newest'
						? 'oldest'
						: 'default'
		);
	};

	const darkTheme = createTheme({
		palette: {
			mode: mode,
		},
	});

	const githubLogin = () => {
		window.location.href = `${apiUrl}/oauth2/authorization/github`;
	};

	useEffect(() => {
		axios
			.get(`${apiUrl}/api/user-info`, { withCredentials: true })
			.then((response) => {
				setUser(response.data);
			})
			.catch((error) => {
				console.error('Error occured: ', error);
			});
	}, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<FormControlLabel
				control={<Switch />}
				label="dark mode"
				onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
			/>
			{user.id != null ? (
				<Box sx={{ p: 2 }}>
					<Typography variant="h6">Welcome, {user.name}</Typography>
					<GithubProfileAnalyzer />
				</Box>
			) : (
				<Button onClick={githubLogin}>Login with GitHub</Button>
			)}
			<Container
				maxWidth={false}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					mt: 2,
				}}
			>
				<CssBaseline />
				<Box>
					<Stack sx={{ display: 'flex', alignItems: 'center' }}>
						<Typography variant="h2">Projects</Typography>
						<Typography variant="h5">Create new Project</Typography>
					</Stack>
					<Stack direction="row" spacing={2} sx={{ mt: 3 }}>
						<TextField
							type="text"
							label="Name"
							name="name"
							value={newProject.name}
							onChange={handleInputChange}
						/>
						<TextField
							type="text"
							label="Description"
							name="description"
							value={newProject.description}
							onChange={handleInputChange}
						/>
						<TextField
							type="text"
							label="GitHub Repository URL"
							name="repositoryLink"
							value={newProject.repositoryLink}
							onChange={handleInputChange}
						/>
						<TextField
							type="text"
							label="Language"
							name="language"
							value={newProject.language}
							onChange={handleInputChange}
						/>
						<TextField
							type="text"
							label="Created At"
							name="createdAt"
							value={newProject.createdAt}
							onChange={handleInputChange}
						/>
						<TextField
							type="text"
							label="Pushed At"
							name="pushedAt"
							value={newProject.pushedAt}
							onChange={handleInputChange}
						/>
						<Button
							variant="contained"
							name="createButton"
							onClick={createProject}
						>
							Create
						</Button>
					</Stack>
					<GithubRepoFetcher setProjectDetails={setProjectDetails} />
				</Box>

				{/* Edit project modal */}
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Edit Project</DialogTitle>
					<DialogContent>
						<TextField
							label="Name"
							fullWidth
							name="name"
							value={editProject?.name || ''}
							onChange={handleEditChange}
							margin="dense"
						/>
						<TextField
							label="Description"
							fullWidth
							name="description"
							value={editProject?.description || ''}
							onChange={handleEditChange}
							margin="dense"
						/>
						<TextField
							label="GitHub Repository URL"
							fullWidth
							name="repositoryLink"
							value={editProject?.repositoryLink || ''}
							onChange={handleEditChange}
							margin="dense"
						/>
						<TextField
							label="Language"
							fullWidth
							name="language"
							value={editProject?.language || ''}
							onChange={handleEditChange}
							margin="dense"
						/>
						<TextField
							label="Created At"
							fullWidth
							name="createdAt"
							onChange={handleEditChange}
							margin="dense"
						/>
						<TextField
							label="Pushed At"
							fullWidth
							name="pushedAt"
							onChange={handleEditChange}
							margin="dense"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="secondary">
							Cancel
						</Button>
						<Button onClick={handleSave} color="primary">
							Save
						</Button>
					</DialogActions>
				</Dialog>


				<Box id="project-box" sx={{ mt: 5, width: '80%' }}>
					<Stack spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant="h4">Project List</Typography>
				<Box sx={{ mt: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
					<Button variant="outlined" onClick={toggleSort}>
						{sortMode === 'default' && 'Click to Sort Alphabetically'}
						{sortMode === 'name' && 'Click to Sort By Newest'}
						{sortMode === 'newest' && 'Click to Sort By Oldest'}
						{sortMode === 'oldest' && 'Clear Sorting'}
					</Button>
					<Box sx={{ minWidth: 230 }}>
						<FormControl fullWidth>
							<InputLabel id="select-label">Language</InputLabel>
							<Select
								labelId="select-label"
								label="Language"
								value={selectedLanguage}
								onChange={handleSearchChange}
								renderValue={() => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										<Chip key={selectedLanguage} label={selectedLanguage} />
									</Box>
								)}
							>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								{languages.map((item) => (
									<MenuItem key={item} value={item}>
										{item}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Box>
				</Box>
						<Masonry columns={3} spacing={2}>
							{filteredProjects.map((project) => (
								<ProjectCard
									key={project.id}
									project={project}
									onEdit={handleEditClick}
									onDelete={deleteProject}
									user={user}
								/>
							))}
						</Masonry>
					</Stack>
				</Box>
				<ScrollToTop />
			</Container>
		</ThemeProvider>
	);
};

export default App;
