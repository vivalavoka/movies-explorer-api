const { Router } = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');

const { updateUserBody } = require('../schemas/users');

const {
  login,
  logout,
  getUser,
  createUser,
  updateUser,
} = require('../controllers/users');

const router = Router();

router.get('/users/me', auth, getUser);
router.patch('/users/me', auth, celebrate({
  [Segments.BODY]: updateUserBody,
}), updateUser);
router.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);
router.get('/signout', auth, logout);

module.exports = router;
