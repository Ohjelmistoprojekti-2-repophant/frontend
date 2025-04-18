import { Box, Typography, Stack, Button } from '@mui/material';
import Reviews from '../Reviews';

const ProjectCard = ({ project, lastCommit, onEdit, onDelete, user }) => {
	return (
		<Box
			key={project.id}
			sx={{
				border: '1px solid #ddd',
				padding: 2,
				borderRadius: 1,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				wordWrap: 'break-word',
			}}
		>
			<Typography variant="h6">{project.name}</Typography>
			<Typography variant="body2">{project.description}</Typography>
			<Typography variant="body2">
				URL:{' '}
				<a
					href={project.repositoryLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					{project.repositoryLink}
				</a>
			</Typography>
			<Typography variant="body2">Language: {project.language}</Typography>
			<Typography variant="body2">
				Created At: {new Date(project.createdAt).toLocaleDateString()}
			</Typography>
			{lastCommit && (
				<Typography variant="body2">Latest commit: {lastCommit}</Typography>
			)}
			<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
				<Button
					variant="outlined"
					color="primary"
					size="small"
					onClick={() => onEdit(project)}
				>
					Edit
				</Button>
				<Button
					variant="outlined"
					color="error"
					size="small"
					onClick={() => onDelete(project.id)}
				>
					Delete
				</Button>
				<Reviews id={project.id} user={user} />
			</Stack>
		</Box>
	);
};

export default ProjectCard;
