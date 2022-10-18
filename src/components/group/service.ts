import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
import { GroupModel } from './model';
import { Group } from './type';

class GroupService {
  #throwIfGroupNotFound(groupExists: boolean, groupId: string) {
    if (!groupExists) {
      throw new AppError(
        `Group does not exists with id: ${groupId}`,
        HttpStatus.NOT_FOUND
      );
    }
  }

  async getAll() {
    return await GroupModel.findAll();
  }

  async getById(id: Group['id']) {
    const group = await GroupModel.findByPk(id);

    this.#throwIfGroupNotFound(Boolean(group), id);

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

    this.#throwIfGroupNotFound(Boolean(updateGroup), id);

    return updateGroup;
  }

  async delete(id: Group['id']) {
    const success = await GroupModel.destroy({ where: { id } });

    this.#throwIfGroupNotFound(Boolean(success), id);
  }
}

const groupService = new GroupService();

export default groupService;
