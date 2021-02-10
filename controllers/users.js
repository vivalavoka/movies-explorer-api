const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = '' } = process.env;

const { tokenKey } = require('../utils/constants');
const { NotFoundError } = require('../errors');
const User = require('../models/user');

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.checkUserByEmail(email)
    .then(() => User.findByIdAndUpdate(
      id,
      { name, email },
      { runValidators: true, new: true },
    ))
    .then((result) => res.send(result))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.checkUserByEmail(email)
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      email,
      name,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.cookie(tokenKey, token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });

      res.send({});
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie(tokenKey);
  res.send({});
};

module.exports = {
  login,
  logout,
  getUser,
  createUser,
  updateUser,
};
