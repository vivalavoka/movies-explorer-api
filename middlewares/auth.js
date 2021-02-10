const jwt = require('jsonwebtoken');

const { tokenKey, defaultJwtSecret } = require('../utils/constants');

const { JWT_SECRET = defaultJwtSecret } = process.env;

const { UnauthorizedError } = require('../errors');

module.exports = (req, res, next) => {
  const token = req.cookies[tokenKey];

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  return next();
};
