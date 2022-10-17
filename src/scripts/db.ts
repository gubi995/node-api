/* eslint-disable no-process-exit */
// eslint-disable-next-line node/no-unpublished-import
import { faker } from '@faker-js/faker';

import logger from '../shared/logger';
import db from '../shared/db';
import { User } from '../components/user';
import UserModel from '../components/user/model';

faker.seed(51536);

const createUser = (): User => ({
  id: faker.datatype.uuid(),
  age: faker.datatype.number({ min: 4, max: 130 }),
  isDeleted: false,
  login: faker.internet.userName(),
  password: faker.internet.password(),
});

const run = async () => {
  try {
    await db.authenticate();

    // Create the DB table.
    await UserModel.sync({ force: true });

    const users = Array(10).fill('').map(createUser);

    // Insert user data.
    await UserModel.bulkCreate(users);
  } catch (error) {
    logger.error(
      `Error during script execution. Error: ${JSON.stringify(Error)}`
    );
  } finally {
    await db.close();

    process.exit(0);
  }
};

run();
