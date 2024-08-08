const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  release_date: { type: Date, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String },
  poster: { type: String } 
});

module.exports = mongoose.model('Movie', movieSchema);
