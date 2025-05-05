import { Button, Dialog, List, ListItemText, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Reviews({ id, user }) {
	const [reviews, setReviews] = useState([]);
	const [open, setOpen] = useState(false);
	const [review, setReview] = useState({
		title: '',
		body: '',
		poster: user.name,
	});

	const handleClickOpen = () => {
		axios.get(`${apiUrl}/api/reviews/${id}`).then((response) => {
			setReviews(response.data);
		});
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		setReview({ ...review, [e.target.name]: e.target.value });
	};

	const handleSave = () => {
		axios
			.post(`${apiUrl}/api/reviews/${id}`, review, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.catch((error) => {
				console.error('Error occured: ', error);
			});

		setReview({
			title: '',
			body: '',
			poster: user.name,
		});

		axios.get(`${apiUrl}/api/reviews/${id}`).then((response) => {
			setReviews(response.data);
		});
	};
	const listReviews = reviews.map((r) => {
		return (
			<List key={r.id}>
				<ListItemText
					primary={r.poster}
					secondary={new Date(r.postedAt).toLocaleString()}
				/>
				<ListItemText primary={r.title} secondary={r.body} />
			</List>
		);
	});

	return (
		<>
			<Button
				variant="outlined"
				color="secondary"
				size="small"
				onClick={handleClickOpen}
			>
				Reviews
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose}>
				<Button
					variant="outlined"
					color="secondary"
					size="small"
					onClick={handleClose}
				>
					Close
				</Button>
				<ul>{listReviews}</ul>

				<TextField
					type="text"
					name="title"
					label="Title"
					value={review.title}
					onChange={(e) => handleInputChange(e)}
				/>
				<TextField
					type="text"
					name="body"
					label="Review"
					value={review.body}
					onChange={(e) => handleInputChange(e)}
				/>
				{Object.keys(user).length === 0 ? (
					<p>Please log in to save your review</p>
				) : (
					<Button
						variant="contained"
						color="primary"
						size="medium"
						onClick={handleSave}
					>
						Save
					</Button>
				)}
			</Dialog>
		</>
	);
}
