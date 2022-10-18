import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { HttpStatus } from '../../types/http-status';

import userService from './service';
import {
  CreateUserSchema,
  DeleteUserSchema,
  GetAutoSuggestUserSchema,
  GetByIdRequestSchema,
  UpdateUserSchema,
} from './type';

class UserController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();

      return res.status(HttpStatus.OK).json({ users });
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
      const user = await userService.getById(req.params.id);

      return res.status(HttpStatus.OK).json({ user });
    } catch (error) {
      next(error);
    }
  };

  async getAutoSuggestions(
    req: ValidatedRequest<GetAutoSuggestUserSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await userService.getAutoSuggestions(
        req.query.login,
        req.query.limit
      );

      return res.status(HttpStatus.OK).json({ users });
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: ValidatedRequest<CreateUserSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await userService.create(req.body);

      return res.status(HttpStatus.CREATED).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: ValidatedRequest<UpdateUserSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await userService.update(req.params.id, req.body);

      return res.status(HttpStatus.OK).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: ValidatedRequest<DeleteUserSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await userService.delete(req.params.id);

      return res.status(HttpStatus.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();

export default userController;
