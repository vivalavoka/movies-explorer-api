const NotFoundError = require('./not-found-error');
const ValidationError = require('./validation-error');
const UnauthorizedError = require('./unauthorized-error');
const InternalError = require('./internal-error');
const ForbiddenError = require('./forbidden-error');

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  InternalError,
  ForbiddenError,
};
