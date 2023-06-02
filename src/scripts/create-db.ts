/* eslint-disable no-process-exit */

import logger from '../shared/logger';
import db from '../shared/db';
import { UserModel } from '../components/user/model';
import { GroupModel } from '../components/group/model';
import { UserGroupModel } from '../components/user-group/model';

const run = async () => {
  try {
    logger.info('DB script for initializing tables just started...');

    await db.authenticate();

    // Create the DB table.
    await UserModel.sync({ force: true });
    await GroupModel.sync({ force: true });
    await UserGroupModel.sync({ force: true });
  } catch (error) {
    logger.error('Error during script execution.', error as Error);
  } finally {
    await db.close();

    process.exit(0);
  }
};

run();
