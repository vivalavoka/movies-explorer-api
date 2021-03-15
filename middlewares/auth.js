const jwt = require('jsonwebtoken');

const { TOKEN_KEY, DEFAULT_JWT_SECRET, AUTHORIZATION_REQUIRED } = require('../utils/constants');

const { JWT_SECRET = DEFAULT_JWT_SECRET } = process.env;

const { UnauthorizedError } = require('../errors');

module.exports = (req, res, next) => {
  const token = req.cookies[TOKEN_KEY];

  if (!token) {
    throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
  }

  req.user = payload;

  return next();
};
