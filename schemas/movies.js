const { Joi, Segments } = require('celebrate');

const { urlRegExp } = require('../utils/validator');

module.exports = {
  saveMovieSchema: {
    [Segments.BODY]: Joi.object().keys({
      movieId: Joi.number().required(),
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().pattern(urlRegExp).required(),
      trailer: Joi.string().pattern(urlRegExp).required(),
      thumbnail: Joi.string().pattern(urlRegExp).required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  },
  removeMovieSchema: {
    [Segments.PARAMS]: Joi.object().keys({
      movieId: Joi.string().hex().min(24)
        .max(24)
        .required(),
    }),
  },
};
