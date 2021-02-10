const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  getMovies,
  removeMovie,
  saveMovie,
} = require('../controllers/movies');

const router = Router();

router.get('/movies', auth, getMovies);
router.post('/movies', auth, celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/https?:\/\/(w{3}\.)?[0-9a-z-._~:/?#[\]@!$&'()*+,;=]+#?/).required(),
    trailer: Joi.string().pattern(/https?:\/\/(w{3}\.)?[0-9a-z-._~:/?#[\]@!$&'()*+,;=]+#?/).required(),
    thumbnail: Joi.string().pattern(/https?:\/\/(w{3}\.)?[0-9a-z-._~:/?#[\]@!$&'()*+,;=]+#?/).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), saveMovie);
router.delete('/movies/:movieId', auth, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().hex().min(24)
      .max(24)
      .required(),
  }),
}), removeMovie);

module.exports = router;
