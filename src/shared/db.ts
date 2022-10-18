import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types/sequelize';

import { UserModel } from '../components/user/model';
import { GroupModel } from '../components/group/model';
import { UserGroupModel } from '../components/user-group/model';
import logger from './logger';
import config from './config';

const sequelize = new Sequelize({
  database: config.get('db.name'),
  dialect: config.get('db.dialect') as Dialect,
  username: config.get('db.username'),
  password: config.get('db.password'),
  models: [UserModel, GroupModel, UserGroupModel],
  logging: (msg) => logger.debug(msg),
});

export default sequelize;
