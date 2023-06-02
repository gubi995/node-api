/* eslint-disable no-process-exit */
// eslint-disable-next-line node/no-unpublished-import
import { faker } from '@faker-js/faker';
import fs from 'fs';

import logger from '../shared/logger';
import db from '../shared/db';
import { User } from '../components/user';
import { UserModel } from '../components/user/model';
import { GroupModel } from '../components/group/model';
import authService from '../components/auth/service';

faker.seed(51536);

const file = fs.createWriteStream('./generated-users.txt');

const createUser = async (): Promise<User> => {
  const password = faker.internet.password();
  const hashedPassword = await authService.hashPassword(password);
  const username = faker.internet.userName();

  file.write(`username=${username};password=${password}\n`);

  return {
    username,
    id: faker.datatype.uuid(),
    age: faker.datatype.number({ min: 4, max: 130 }),
    isDeleted: false,
    password: hashedPassword,
  };
};

const run = async () => {
  try {
    logger.info('DB script for seeding data just started...');

    await db.authenticate();

    // Insert data.
    const readonlyGroup = await GroupModel.create({
      id: faker.datatype.uuid(),
      name: 'Read only',
      permissions: ['READ'],
    });
    const adminGroup = await GroupModel.create({
      id: faker.datatype.uuid(),
      name: 'Admin',
      permissions: ['READ', 'WRITE', 'DELETE'],
    });
    const generatedUsers = await Promise.all(
      Array(10).fill('').map(createUser)
    );
    const users = await UserModel.bulkCreate(generatedUsers);

    await Promise.all([
      readonlyGroup.$add('User', users[0]),
      readonlyGroup.$add('User', users[1]),
      readonlyGroup.$add('User', users[2]),
      readonlyGroup.$add('User', users[3]),
      adminGroup.$add('User', users[4]),
      adminGroup.$add('User', users[5]),
    ]);
  } catch (error) {
    logger.error('Error during script execution.', error as Error);
  } finally {
    await db.close();

    process.exit(0);
  }
};

run();
