const moviesRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');

moviesRouters.get('/movies', getMovies);
moviesRouters.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.string().required().min(2).max(30),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
}), createMovies);
moviesRouters.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovies);

module.exports = { moviesRouters };
