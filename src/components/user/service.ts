import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../utils/error';
import UserModel from './model';
import { User } from './types';

class UserService {
  #throwIfUserNotFound(userExists: boolean, userId: string) {
    if (!userExists) {
      throw new AppError(
        `User does not exists with id: ${userId}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  async getAll() {
    return await UserModel.getAll();
  }

  async getById(id: User['id']) {
    const user = await UserModel.getById(id);

    this.#throwIfUserNotFound(Boolean(user), id);

    return user;
  }

  async create(user: Omit<User, 'id'>) {
    return await UserModel.create(user);
  }

  async update(id: string, user: Partial<User>) {
    const updateUser = await UserModel.update({ ...user, id });

    this.#throwIfUserNotFound(Boolean(updateUser), id);

    return updateUser;
  }

  async delete(id: User['id']) {
    const success = await UserModel.delete(id);

    this.#throwIfUserNotFound(success, id);
  }
}

const userService = new UserService();

export default userService;