import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
import { UserModel } from './model';
import { User } from './type';

class UserService {
  #checkIfUserNotFound(userExists: boolean, userId: string) {
    if (!userExists) {
      throw new AppError({
        description: `User does not exists with id: ${userId}`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async getAll() {
    return await UserModel.findAll();
  }

  async getById(id: User['id']) {
    const user = await UserModel.findByPk(id);

    this.#checkIfUserNotFound(Boolean(user), id);

    return user;
  }

  async getAutoSuggestions(loginSubstring: string, limit: number) {
    const users = await UserModel.findAll();

    const suggestedUsers = users.filter(({ username }) =>
      username.includes(loginSubstring)
    );

    const limitedSuggestion = suggestedUsers.slice(0, limit);

    limitedSuggestion.sort((userA, userB) =>
      userA.username.localeCompare(userB.username)
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

    this.#checkIfUserNotFound(Boolean(updateUser), id);

    return updateUser;
  }

  async delete(id: User['id']) {
    const [success] = await UserModel.update(
      { isDeleted: true },
      { where: { id } }
    );

    this.#checkIfUserNotFound(Boolean(success), id);
  }
}

const userService = new UserService();

export default userService;
