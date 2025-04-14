import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Typography, Box, Stack } from '@mui/material';

/**
 * GithubRepoFetcher component fetches details of a GitHub repository and sets the project details.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setProjectDetails - Function to set the project details.
 *
 * @returns {JSX.Element} The rendered component.
 */
const GithubRepoFetcher = ({ setProjectDetails }) => {
	const [repoUrl, setRepoUrl] = useState('');
	const [error, setError] = useState(null);
	const [lastCommitDate, setLastCommitDate] = useState(null);

	/**
	 * Fetches the details of a GitHub repository from the provided URL.
	 * If the URL is valid and the repository is found, sets the project details.
	 * Otherwise, sets an error message.
	 */
	const fetchRepoDetails = useCallback(async () => {
		// Validate the GitHub repository URL
		if (!repoUrl.startsWith('https://github.com/')) {
			setError('Invalid GitHub repository URL');
			return;
		}

		// Extract the repository path from the URL
		const repoPath = repoUrl.replace('https://github.com/', '');

		try {
			// Fetch repository details from the GitHub API
			const response = await fetch(`https://api.github.com/repos/${repoPath}`);
			if (!response.ok) {
				throw new Error('Repository not found');
			}
			const data = await response.json();

			// Fetch the last commit date
			const commitsResponse = await fetch(
				`https://api.github.com/repos/${repoPath}/commits?per_page=1`
			);
			if (commitsResponse.ok) {
				const commitsData = await commitsResponse.json();
				if (commitsData.length > 0) {
					setLastCommitDate(
						new Date(commitsData[0].commit.author.date).toLocaleDateString('fi-FI')
					);
				}
			}

			// Set the project details with the fetched data
			setProjectDetails({
				name: data.full_name,
				description: data.description,
				html_url: data.html_url,
				language: data.language,
				created_at: data.created_at,
			});
			setError(null);
		} catch (error) {
			// Set an error message if the fetch fails
			setError(`Failed to fetch repository details: ${error.message}`);
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
			{lastCommitDate && (
				<Typography variant="body1" sx={{ mt: 2 }}>
					Last Commit: {lastCommitDate}
				</Typography>
			)}
		</Box>
	);
};

/**
 * PropTypes definition for GithubRepoFetcher component.
 * @prop {function} setProjectDetails - Function to set the project details fetched from the GitHub repository.
 */
GithubRepoFetcher.propTypes = {
	setProjectDetails: PropTypes.func.isRequired,
};

export default GithubRepoFetcher;
