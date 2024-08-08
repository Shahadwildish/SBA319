const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const Comment = require('../models/comment');
const app = express();

// fetch comments for a specific movie
app.get('/movies/:movieId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ movieId: req.params.movieId }).populate('userId', 'username');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
});

app.get('/movies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get movies with pagination
router.get('/', async (req, res) => {
    try {
        const { genre, rating, page = 1, limit = 10 } = req.query;
        const query = {};

        if (genre) {
            query.genres = { $in: [genre] }; // Check if the genre is in the genres array... bbut the search is still case sensitive... why???
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
