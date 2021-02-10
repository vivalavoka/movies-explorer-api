const express = require('express');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const { MONGO_HOST = 'localhost', MONGO_PORT = '27017', MONGO_DB = 'bitfilmsdb' } = process.env;

const { NotFoundError } = require('./errors');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const users = require('./routes/users');
const movies = require('./routes/movies');

const mongoUrl = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

const limitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limitter);
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/', users, movies);

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());

app.use(error);

module.exports = app;
