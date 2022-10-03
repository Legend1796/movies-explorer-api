const moviesRouters = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovies, deleteMovies
} = require('../controllers/movies');

moviesRouters.get('/movies', getMovies);
moviesRouters.post('/movies', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.string().required().min(2).max(30),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().min(2),
    owner: Joi.string().length(24).hex().required(),
    movieId: Joi.string().length(24).hex().required(),
    nameRU: Joi.string().required().min(2).max(30),
    nameEn: Joi.string().required().min(2).max(30),
    trailerLink: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
    thumbnail: Joi.string().required().pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?#?$/),
  }),
}), createMovies);
moviesRouters.delete('/movies/:moviesId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovies);

module.exports = { moviesRouters };
