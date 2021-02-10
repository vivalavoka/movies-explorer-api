const jwt = require('jsonwebtoken');

const { JWT_SECRET = '' } = process.env;

const { tokenKey } = require('../utils/constants');
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
