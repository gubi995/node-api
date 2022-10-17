import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
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
    return await UserModel.findAll();
  }

  async getById(id: User['id']) {
    const user = await UserModel.findByPk(id);

    this.#throwIfUserNotFound(Boolean(user), id);

    return user;
  }

  async getAutoSuggestUsers(loginSubstring: string, limit: number) {
    const users = await UserModel.findAll();

    const suggestedUsers = users.filter(({ login }) =>
      login.includes(loginSubstring)
    );

    const limitedSuggestion = suggestedUsers.slice(0, limit);

    limitedSuggestion.sort((userA, userB) =>
      userA.login.localeCompare(userB.login)
    );

    return limitedSuggestion;
  }

  async create(user: Omit<User, 'id'>) {
    return await UserModel.create(user);
  }

  async update(id: string, user: Partial<User>) {
    const [, updateUser] = await UserModel.update(user, {
      where: { id },
      returning: true,
    });

    this.#throwIfUserNotFound(Boolean(updateUser), id);

    return updateUser;
  }

  async delete(id: User['id']) {
    const success = await UserModel.destroy({ where: { id } });

    this.#throwIfUserNotFound(Boolean(success), id);
  }
}

const userService = new UserService();

export default userService;
