import { Op, Transaction } from 'sequelize';

import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
import { UserModel } from '../user/model';
import { User } from '../user';
import { GroupModel } from './model';
import { Group } from './type';

class GroupService {
  checkIfGroupNotFound(groupExists: boolean, groupId: string) {
    if (!groupExists) {
      throw new AppError({
        description: `Group does not exists with id: ${groupId}`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  async getAll() {
    return await GroupModel.findAll();
  }

  async getById(id: Group['id']) {
    const group = await GroupModel.findByPk(id);

    this.checkIfGroupNotFound(Boolean(group), id);

    return group;
  }

  async create(group: Omit<Group, 'id'>) {
    return await GroupModel.create(group);
  }

  async update(id: string, group: Partial<Group>) {
    const [, updateGroup] = await GroupModel.update(group, {
      where: { id },
      returning: true,
    });

    this.checkIfGroupNotFound(Boolean(updateGroup), id);

    return updateGroup;
  }

  async delete(id: Group['id']) {
    const success = await GroupModel.destroy({ where: { id } });

    this.checkIfGroupNotFound(Boolean(success), id);
  }

  checkIfOneOfTheUsersNotFound(
    users: Array<UserModel>,
    providedUserIds: Array<User['id']>
  ) {
    if (users.length === providedUserIds.length) return;

    const foundUserIds = users.map(({ id }) => id);
    const notExistingUserIds = providedUserIds.filter(
      (id) => !foundUserIds.includes(id)
    );

    throw new AppError({
      description: `User(s) not found with the following id(s): ${notExistingUserIds}`,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }

  checkIfOneOfTheUsersIsAlreadyPartOfTheGroup(
    group: GroupModel,
    providedUserIds: Array<User['id']>
  ) {
    const usersIdsInTheGroup = group.users.map(({ id }) => id);

    const usersIdsAlreadyInTheGroup = providedUserIds.filter((id) =>
      usersIdsInTheGroup.includes(id)
    );

    if (usersIdsAlreadyInTheGroup.length) {
      throw new AppError({
        description: `User(s) with the following id(s) is/are already part of the group: ${usersIdsAlreadyInTheGroup}`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getGroupAndUsersToAdd(
    groupId: Group['id'],
    userIds: Array<User['id']>,
    transaction: Transaction
  ) {
    const [group, users] = await Promise.all([
      await GroupModel.findByPk(groupId, {
        include: [UserModel],
        transaction,
      }),
      await UserModel.findAll({
        where: {
          id: {
            [Op.in]: userIds,
          },
        },
        transaction,
      }),
    ]);

    return { group, users };
  }

  async addUsersToGroup(
    group: GroupModel,
    users: Array<UserModel>,
    transaction: Transaction
  ) {
    await group?.$add('User', users, { transaction });

    const newGroup = await GroupModel.findByPk(group.id, {
      include: [UserModel],
      transaction,
    });

    return newGroup as GroupModel;
  }
}

const groupService = new GroupService();

export default groupService;
