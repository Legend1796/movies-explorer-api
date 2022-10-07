const Movie = require('../models/movie');
const BadreqestError = require('../utils/BadreqestError');
const ForbiddenError = require('../utils/ForbiddenError');
const ServerError = require('../utils/ServerError');
const NotfoundError = require('../utils/NotfoundError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    res.send(movie);
  } catch (err) {
    next(new ServerError('Произошла ошибка на сервере'));
  }
};

module.exports.createMovies = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      movieId,
      nameRU,
      nameEN,
    });
    res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.send(err);
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};

module.exports.deleteMovies = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      next(new NotfoundError('Такой карточки не существует'));
    } else if (movie.owner.toString() !== req.user._id) {
      next(new ForbiddenError('У вас нет прав на удаление этой карточки'));
    } else {
      await Movie.deleteOne(movie);
      res.send(movie);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadreqestError('Переданы некорректные данные'));
    } else {
      next(new ServerError('Произошла ошибка на сервере'));
    }
  }
};
