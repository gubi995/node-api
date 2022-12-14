import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { HttpStatus } from '../../types/http-status';
import db from '../../shared/db';

import groupService from './service';
import {
  AddUsersToGroupSchema,
  CreateGroupSchema,
  DeleteGroupSchema,
  GetByIdRequestSchema,
  UpdateGroupSchema,
} from './type';
import { GroupModel } from './model';

class GroupController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await groupService.getAll();

      return res.status(HttpStatus.OK).json({ groups });
    } catch (error) {
      next(error);
    }
  }

  getById = async (
    req: ValidatedRequest<GetByIdRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const group = await groupService.getById(req.params.id);

      return res.status(HttpStatus.OK).json({ group });
    } catch (error) {
      next(error);
    }
  };

  async create(
    req: ValidatedRequest<CreateGroupSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const group = await groupService.create(req.body);

      return res.status(HttpStatus.CREATED).json({ group });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: ValidatedRequest<UpdateGroupSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const group = await groupService.update(req.params.id, req.body);

      return res.status(HttpStatus.OK).json({ group });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: ValidatedRequest<DeleteGroupSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await groupService.delete(req.params.id);

      return res.status(HttpStatus.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }

  async addUsersToGroup(
    req: ValidatedRequest<AddUsersToGroupSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const group = await db.transaction(async (transaction) => {
        const groupId = req.params.id;
        const userIds = req.body.userIds;

        const { group, users } = await groupService.getGroupAndUsersToAdd(
          groupId,
          userIds,
          transaction
        );

        groupService.checkIfGroupNotFound(Boolean(group), groupId);
        groupService.checkIfOneOfTheUsersIsAlreadyPartOfTheGroup(
          group as GroupModel,
          userIds
        );
        groupService.checkIfOneOfTheUsersNotFound(users, userIds);

        const updatedGroup = groupService.addUsersToGroup(
          group as GroupModel,
          users,
          transaction
        );

        return updatedGroup;
      });

      return res.status(HttpStatus.OK).json({ group });
    } catch (error) {
      next(error);
    }
  }
}

const groupController = new GroupController();

export default groupController;
