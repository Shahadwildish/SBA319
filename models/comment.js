const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    movie_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  email: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
