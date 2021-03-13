const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { TOKEN_KEY, DEFAULT_JWT_SECRET, USER_NOT_FOUND } = require('../utils/constants');

const { JWT_SECRET = DEFAULT_JWT_SECRET } = process.env;

const { NotFoundError } = require('../errors');
const User = require('../models/user');

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
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

      res.cookie(TOKEN_KEY, token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });

      res.send({});
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie(TOKEN_KEY);
  res.send({});
};

module.exports = {
  login,
  logout,
  getUser,
  createUser,
  updateUser,
};
