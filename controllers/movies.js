const { NotFoundError, ForbiddenError } = require('../errors');
const { MOVIE_NOT_FOUND, MOVIE_ALREADY_SAVED, MOVIE_DELETE_RESTRICTED } = require('../utils/constants');
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
  Movie.findOne({ movieId: req.body.movieId })
    .then((movie) => {
      if (movie) {
        throw new ForbiddenError(MOVIE_ALREADY_SAVED);
      }
      return Movie.create({
        ...req.body,
        owner: user._id,
      });
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
        throw new NotFoundError(MOVIE_NOT_FOUND);
      }
      if (movie.owner.toString() !== user._id) {
        throw new ForbiddenError(MOVIE_DELETE_RESTRICTED);
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
