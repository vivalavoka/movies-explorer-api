const { Joi } = require('celebrate');

module.exports = {
  updateUserBody: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
};
