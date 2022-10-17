import http from 'http';

import app from './src/app';
import db from './src/shared/db';
import logger from './src/shared/logger';
import config from './src/shared/config';
import { initProcessHandlers } from './src/utils/process';

const server = http.createServer(app);

const run = async () => {
  try {
    await db.authenticate();

    server.listen(config.get('port'), () => {
      logger.info('Server is listening on: http://localhost:3000');
    });

    initProcessHandlers(server);
  } catch (error) {
    logger.error(
      `An unexpected error happened during startup. Error: ${JSON.stringify(
        error
      )}`
    );
  }
};

run();
