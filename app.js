const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const commentRoutes = require('./routes/comments');
const path = require('path');
const config = require('./config');
const Movie = require('./models/movie');
const Comment = require('./models/comment');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/comments', commentRoutes);

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

app.get('/movies/:id/comments', async (req, res) => {
    try {
        const movieId = req.params.id;
        // Fetch comments associated with the movie ID
        const comments = await Comment.find({ movie_id: movieId });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
