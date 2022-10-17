import { Sequelize } from 'sequelize';

import logger from './logger';
import config from './config';

const sequelize = new Sequelize(config.get('db'), {
  logging: (msg) => logger.debug(msg),
});

export default sequelize;
