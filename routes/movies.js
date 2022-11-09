const moviesRouters = require('express').Router();
const validator = require('validator');

const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');

const method = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('Неправильный формат ссылки');
};

moviesRouters.get('/movies', getMovies);
moviesRouters.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(method),
    trailerLink: Joi.string().required().custom(method),
    thumbnail: Joi.string().required().custom(method),
    movieId: Joi.required(),
    // movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovies);
moviesRouters.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovies);

module.exports = { moviesRouters };
