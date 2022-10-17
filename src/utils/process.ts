/* eslint-disable no-process-exit */
import { Server } from 'http';

import db from '../shared/db';
import logger from '../shared/logger';
import { errorHandler } from '../shared/error';

export const shutdownGracefullyWithExitCode = (
  server: Server,
  exitCode: number
) => {
  server.close(async () => {
    logger.info('Server shut down gracefully.');

    await db.close();

    logger.info('DB shut down gracefully');

    process.exit(exitCode);
  });
};

export const initProcessHandlers = (server: Server) => {
  process.on('unhandledRejection', (reason: string) => {
    throw Error(reason);
  });

  process.on('uncaughtException', (error) => {
    const appError = errorHandler.parse(error);

    errorHandler.handleError(appError);

    if (!errorHandler.isTrustedError(appError)) {
      logger.error(appError);

      shutdownGracefullyWithExitCode(server, 1);
    }
  });

  process.on('SIGINT', () => {
    logger.debug('SIGINT signal received.');

    shutdownGracefullyWithExitCode(server, 0);
  });

  process.on('SIGTERM', () => {
    logger.debug('SIGTERM signal received.');

    shutdownGracefullyWithExitCode(server, 0);
  });
};
