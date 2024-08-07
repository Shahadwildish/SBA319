const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const Comment = require('../models/comment');

// Fetch comments for a specific movie
router.get('/:movieId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ movieId: req.params.movieId }).populate('userId', 'username');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
});

// Get movies with pagination
router.get('/', async (req, res) => {
    try {
        const { genre, rating, page = 1, limit = 10 } = req.query;
        const query = {};

        if (genre) {
            query.genres = { $in: [genre] }; // Check if the genre is in the genres array
        }
        if (rating) query.rating = { $gte: rating };

        const movies = await Movie.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        const totalMovies = await Movie.countDocuments(query).exec();

        res.json({
            movies,
            pagination: {
                totalMovies,
                totalPages: Math.ceil(totalMovies / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
