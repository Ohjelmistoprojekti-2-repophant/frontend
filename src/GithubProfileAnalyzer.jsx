import { useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Chip, Stack, TextField, Button, List, ListItem, ListItemText, Alert } from '@mui/material';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Initial state for analysis
const INITIAL_ANALYSIS = {
  technologies: new Set(),
  practices: {
    hasReadme: 0,
    hasTests: 0,
    hasIssues: 0
  },
  projects: {
    total: 0,
    personal: 0,
    forked: 0
  }
};

const fetchRepositoryContents = async (username, repoName, token) => {
  const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/contents`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data.map(item => item.name.toLowerCase());
};

const analyzeRepository = (repo, analysis) => {
  analysis.projects.total++;
  if (repo.fork) analysis.projects.forked++;
  if (!repo.fork) analysis.projects.personal++;
  if (repo.language) analysis.technologies.add(repo.language);
  if (repo.has_issues) analysis.practices.hasIssues++;
  return analysis;
};

const checkDevelopmentPractices = (files, analysis) => {
  if (files.includes('readme.md')) analysis.practices.hasReadme++;
  if (files.some(file => file.includes('test'))) analysis.practices.hasTests++;
  return analysis;
};


const GithubProfileAnalyzer = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');

  const analyzeProfile = async (targetUsername) => {
    setLoading(true);
    setError(null);
    try {
      const tokenResponse = await axios.get(`${apiUrl}/api/github-token`, { withCredentials: true });
      const token = tokenResponse.data.token;

      const reposResponse = await axios.get(`https://api.github.com/users/${targetUsername}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token}`
        },
        params: {
          sort: 'updated',
          per_page: 100
        }
      });

      let analysis = { ...INITIAL_ANALYSIS };

      for (const repo of reposResponse.data) {
        analysis = analyzeRepository(repo, analysis);
        
        const files = await fetchRepositoryContents(targetUsername, repo.name, token);
        analysis = checkDevelopmentPractices(files, analysis);
      }

      setProfileData({
        ...analysis,
        technologies: Array.from(analysis.technologies)
      });
    } catch {
      setError('Failed to analyze profile. Please check if the username is correct and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      analyzeProfile(username.trim());
    }
  };

  const LoadingIndicator = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );

  const ErrorMessage = ({ message }) => (
    <Alert severity="error" sx={{ mt: 4 }}>
      {message}
    </Alert>
  );

  const TechnologiesSection = ({ technologies }) => (
    <Box>
      <Typography variant="h6" gutterBottom>Technologies</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {technologies.map((tech, index) => (
          <Chip key={index} label={tech} />
        ))}
      </Box>
    </Box>
  );

  const ProjectsSection = ({ projects }) => (
    <Box>
      <Typography variant="h6" gutterBottom>Projects</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Total Projects" secondary={projects.total} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Personal Projects" secondary={projects.personal} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Forked Projects" secondary={projects.forked} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Archived Projects" secondary={projects.archived} />
        </ListItem>
      </List>
    </Box>
  );

  const PracticesSection = ({ practices, totalProjects }) => (
    <Box>
      <Typography variant="h6" gutterBottom>Development Practices</Typography>
      <List>
        <ListItem>
          <ListItemText 
            primary="Projects with README" 
            secondary={`${practices.hasReadme} out of ${totalProjects} projects`}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Projects with Tests" 
            secondary={`${practices.hasTests} out of ${totalProjects} projects`}
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="Projects with Issue Tracking" 
            secondary={`${practices.hasIssues} out of ${totalProjects} projects`}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained">
            Analyze
          </Button>
        </Stack>
      </form>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      {profileData && !loading && !error && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {username}&apos;s GitHub Profile Analysis
          </Typography>
          
          <Stack spacing={3}>
            <TechnologiesSection technologies={profileData.technologies} />
            <ProjectsSection projects={profileData.projects} />
            <PracticesSection 
              practices={profileData.practices} 
              totalProjects={profileData.projects.total} 
            />
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default GithubProfileAnalyzer; 