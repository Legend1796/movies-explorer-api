const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'Неправильный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'Неправильный формат ссылки',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: String,
    // type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    minlength: 2,
    required: true,
  },
  nameEN: {
    type: String,
    minlength: 2,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
