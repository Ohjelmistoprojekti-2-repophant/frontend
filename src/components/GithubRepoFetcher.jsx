import { useState, useCallback } from 'react';
import { TextField, Button, Typography, Box, Stack } from '@mui/material';
import axios from 'axios'; // Import axios

const proxyUrl = import.meta.env.VITE_PROXY_URL;

const GithubRepoFetcher = ({ setProjectDetails }) => {
	const [repoUrl, setRepoUrl] = useState('');
	const [error, setError] = useState(null);

	const fetchRepoDetails = useCallback(async () => {
		// Validate the GitHub repository URL
		if (!repoUrl.startsWith('https://github.com/')) {
			setError('Invalid GitHub repository URL');
			return;
		}

		// Extract the repository path from the URL
		const repoPath = repoUrl.replace('https://github.com/', '');

		try {
			// Fetch repository details from the GitHub API using axios
			const response = await axios.get(`${proxyUrl}/repos/${repoPath}`);
			const data = response.data;

			// Set the project details with the fetched data
			setProjectDetails({
				name: data.full_name,
				description: data.description,
				html_url: data.html_url,
				language: data.language,
				created_at: data.created_at,
				pushed_at: data.pushed_at,
			});
			setError(null);
		} catch (error) {
			// Set an error message if the fetch fails
			setError(
				`Failed to fetch repository details: ${
					error.response?.data?.message || error.message
				}`
			);
		}
	}, [repoUrl, setProjectDetails]);

	return (
		<Box>
			<Stack direction="row" spacing={2} sx={{ mt: 3 }}>
				<TextField
					type="text"
					name="repositoryFetchInput"
					placeholder="GitHub Repository URL"
					value={repoUrl}
					onChange={(e) => setRepoUrl(e.target.value)}
					fullWidth
				/>
				<Button
					variant="contained"
					name="fetchButton"
					onClick={fetchRepoDetails}
				>
					Fetch & Fill Fields
				</Button>
			</Stack>
			{error && (
				<Typography variant="body1" color="error" sx={{ mt: 3 }}>
					{error}
				</Typography>
			)}
		</Box>
	);
};

export default GithubRepoFetcher;
