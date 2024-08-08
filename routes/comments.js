const express = require('express');
const router = express.Router();
const Movie = require('../models/movie'); 
const mongoose = require('mongoose');
const Comment = require('../models/comment');

const app = express();
app.use(express.json());


router.get('/movies/:id/comments', async (req, res) => {
    try {
        const movieId = req.params.id;

        const comments = await Comment.find({ movie: movieId });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Add a comment
router.post('/movies/:id/comments', async (req, res) => {
    const { text } = req.body;
    try {
        const comment = new Comment({
            user_id: req.user.id, // You'll need to add authentication middleware to get req.user
            movie_id: req.params.id,
            text
        });
        await comment.save();
        res.status(201).json({ message: 'Comment added successfully!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        res.json({ message: 'Comment deleted successfully!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
