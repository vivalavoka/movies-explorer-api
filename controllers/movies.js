const { NotFoundError, ForbiddenError } = require('../errors');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  const id = req.user._id;
  Movie.find({ owner: id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const saveMovie = (req, res, next) => {
  const { user } = req;
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const removeMovie = (req, res, next) => {
  const { user } = req;
  const { movieId } = req.params;
  Movie.findById(movieId)
    .select('owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }
      if (movie.owner.toString() !== user._id) {
        throw new ForbiddenError('Невозможно удалить эту карточку');
      }
      return Movie.findByIdAndDelete(movieId);
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  saveMovie,
  removeMovie,
};
