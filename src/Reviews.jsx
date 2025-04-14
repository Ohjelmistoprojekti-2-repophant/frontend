import { Button, Dialog, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Reviews({ id, user }) {
    const [reviews, setReviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState({
        title: '',
        body: '',
        poster: user.name
    });

    const handleClickOpen = () => {
        axios.get(`${apiUrl}/api/reviews/${id}`)
            .then(response => {
                setReviews(response.data)
            })
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleInputChange = e => {
        setReview({ ...review, [e.target.name]: e.target.value })
    }

    const handleSave = () => {
        axios.post(`${apiUrl}/api/reviews/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        })

        setReview({
            title: '',
            body: '',
            poster: user.name
        });
    }
    const listReviews = reviews.map(r => {
        return (
            <li key={r.id}>
                <p>{r.poster}</p>
                <p>{r.title}</p>
                <p>{r.body}</p>
                <p>{r.postedAt}</p>
            </li>
        )
    })

    return (

        <>
            <Button variant="outlined" color="secondary" size="small" onClick={handleClickOpen}>Reviews</Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <Button variant="outlined" color="secondary" size="small" onClick={handleClose}>Close</Button>
                <ul>{listReviews}</ul>

                <TextField
                    type="text"
                    name="title"
                    label="Title"
                    value={review.title}
                    onChange={e => handleInputChange(e)}
                />
                <TextField
                    type="text"
                    name="body"
                    label="Review"
                    value={review.body}
                    onChange={e => handleInputChange(e)}
                />
                <Button variant="contained" color="primary" size="medium" onClick={handleSave}>Save</Button>
            </Dialog>
        </>
    )

}