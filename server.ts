/* eslint-disable no-process-exit */

import http from 'http';

import app from './src/app';
import { errorHandler } from './src/shared/error';
import logger from './src/shared/logger';

const PORT = 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info('Server is listening on: http://localhost:3000');
});

process.on('unhandledRejection', (reason: string) => {
  throw Error(reason);
});

process.on('uncaughtException', (error) => {
  const appError = errorHandler.parse(error);

  errorHandler.handleError(appError);

  if (!errorHandler.isTrustedError(appError)) {
    logger.error(appError);

    server.close(() => {
      process.exit(1);
    });
  }
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received.');

  server.close(() => {
    logger.info('Server shut down gracefully.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');

  server.close(() => {
    logger.info('Server shut down gracefully.');
    process.exit(0);
  });
});
