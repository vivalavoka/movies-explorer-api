require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const { EXPRESS_PORT = 3000 } = process.env;

const server = app.listen(EXPRESS_PORT, () => {
  logger.info(`App listening on port ${EXPRESS_PORT}`);
});

process.on('unhandledRejection', () => {});
process.on('rejectionHandled', () => {});
process.on('exit', () => {
  server.close();
});
