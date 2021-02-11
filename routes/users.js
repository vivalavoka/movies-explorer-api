const { Router } = require('express');
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');

const { updateUserSchema, createUserSchema, loginSchema } = require('../schemas/users');

const {
  login,
  logout,
  getUser,
  createUser,
  updateUser,
} = require('../controllers/users');

const router = Router();

router.get('/users/me', auth, getUser);
router.patch('/users/me', auth, celebrate(updateUserSchema), updateUser);
router.post('/signup', celebrate(createUserSchema), createUser);
router.post('/signin', celebrate(loginSchema), login);
router.get('/signout', auth, logout);

module.exports = router;
