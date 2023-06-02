import http from 'http';
import { AddressInfo } from 'net';

import app from './src/app';
import db from './src/shared/db';
import logger from './src/shared/logger';
import config from './src/shared/config';
import {
  initProcessHandlers,
  shutdownGracefullyWithExitCode,
} from './src/utils/process';

const server = http.createServer(app);

export const startServer = async () => {
  const env = config.get('env');
  const port = env !== 'test' ? config.get('port') : undefined;

  await db.authenticate();

  await new Promise((resolve) => {
    const listener = server.listen(port, () => {
      const serverPort = (listener.address() as AddressInfo).port;

      logger.info(`Server is listening on: http://localhost:${serverPort}`);

      resolve(server);
    });
  });

  initProcessHandlers(server);
};

export const stopServer = () => {
  shutdownGracefullyWithExitCode(server, 0);
};

export const runAppOnHttp = async () => {
  try {
    await startServer();
  } catch (error) {
    logger.error('An unexpected error happened during startup', error as Error);
  }
};
