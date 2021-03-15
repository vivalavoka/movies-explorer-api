const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { UnauthorizedError } = require('../errors');
const { USER_ALREADY_EXISTS, INVALID_CREDENTIALS } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: 'email не может быть пустым',
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: 'password не может быть пустым',
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      required: 'name не может быть пустым',
      minlength: 2,
      maxlength: 30,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(INVALID_CREDENTIALS));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError(INVALID_CREDENTIALS));
        }
        return user;
      });
    });
};

userSchema.statics.checkUserByEmail = function (email, userId = null) {
  return this.findOne({ email })
    .then((user) => {
      if (user && (!userId || user._id.toString() !== userId)) {
        return Promise.reject(new UnauthorizedError(USER_ALREADY_EXISTS));
      }
      return Promise.resolve();
    });
};

module.exports = mongoose.model('user', userSchema);
