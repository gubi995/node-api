import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
import { UserModel } from './model';
import { User } from './type';

class UserService {
  #checkIfUserNotFound(userExists: boolean, userFields: Partial<User>) {
    if (!userExists) {
      throw new AppError({
        description: `User does not exists by: ${Object.entries(
          userFields
        ).reduce(
          (keyValues, [key, value]) => `${keyValues};${key}=${value}`,
          ''
        )}`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async getAll() {
    return await UserModel.findAll();
  }

  async getByField(userFields: Partial<User>) {
    const user = await UserModel.findOne({
      where: {
        ...userFields,
      },
    });

    this.#checkIfUserNotFound(Boolean(user), userFields);

    return user as UserModel;
  }

  async getUsersWithSimilarUsername(usernameSubstring: string) {
    const users = await UserModel.findAll();

    const suggestedUsers = users.filter(({ username }) =>
      username.includes(usernameSubstring)
    );

    return suggestedUsers;
  }

  async sliceAndSortUsersByLimit(
    suggestedUsers: Array<UserModel>,
    limit: number
  ) {
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

    this.#checkIfUserNotFound(Boolean(updateUser), { id });

    return updateUser;
  }

  async softDelete(id: User['id']) {
    const [success] = await UserModel.update(
      { isDeleted: true },
      { where: { id } }
    );

    this.#checkIfUserNotFound(Boolean(success), { id });
  }
}

const userService = new UserService();

export default userService;
