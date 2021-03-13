const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const { MONGO_HOST = 'localhost', MONGO_PORT = '27017', MONGO_DB = 'bitfilmsdb' } = process.env;

const { NotFoundError } = require('./errors');
const error = require('./middlewares/error');
const { RESOURCE_NOT_FOUND } = require('./utils/constants');
const limitter = require('./middlewares/rate-limitter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes');

const mongoUrl = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(limitter());
// app.use(helmet());
app.use(cors({
  origin: ['https://nechitaylo.students.nomoredomains.work', 'https://www.nechitaylo.students.nomoredomains.work'],
  credentials: true,
  allowedHeaders: ['Origin', 'Set-Cookie', 'Accept', 'X-Requested-With', 'Content-Type', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Headers'],
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/', routes.users, routes.movies);

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError(RESOURCE_NOT_FOUND));
});

app.use(errors());

app.use(error);

module.exports = app;
