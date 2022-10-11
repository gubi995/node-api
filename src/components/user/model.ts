/* eslint-disable security/detect-object-injection */

import { randomUUID } from 'crypto';
import { User } from './types';

const DEFAULT_USERS: User[] = [
  {
    id: '7a49972f-0629-496d-9e4e-3f1eed9e32aa',
    age: 30,
    isDeleted: false,
    login: 'admin',
    password: 'admin123',
  },
  {
    id: 'fe637d8a-b4e4-43b2-9b53-487843693558',
    age: 18,
    isDeleted: true,
    login: 'user',
    password: 'user123',
  },
];

class UserModel {
  #users: User[] = DEFAULT_USERS;

  async getAll() {
    return this.#users;
  }

  async getById(id: User['id']) {
    return this.#users.find((user) => user.id === id);
  }

  async create(user: Omit<User, 'id'>) {
    const newUser = { ...user, id: randomUUID() };

    this.#users.push(newUser);

    return newUser;
  }

  async update(user: Partial<User>) {
    const userId = user.id;
    const userIndex = this.#users.findIndex(({ id }) => id === userId);

    if (userIndex === -1) return null;

    const { id, ...fieldsToUpdate } = user;

    this.#users[userIndex] = { ...this.#users[userIndex], ...fieldsToUpdate };

    return this.#users[userIndex];
  }

  async delete(id: User['id']) {
    const userIndex = this.#users.findIndex((user) => user.id === id);

    if (userIndex === -1) return false;

    this.#users[userIndex].isDeleted = true;

    return true;
  }
}

const userModel = new UserModel();

export default userModel;
