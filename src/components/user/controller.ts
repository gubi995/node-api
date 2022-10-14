import { Request, Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { HttpStatus } from '../../types/http-status';

import UserService from './service';
import {
  CreateUserSchema,
  DeleteUserSchema,
  GetAutoSuggestUserSchema,
  GetByIdRequestSchema,
  UpdateUserSchema,
} from './types';

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.getAll();

    return res.status(HttpStatus.OK).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: ValidatedRequest<GetByIdRequestSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.getById(req.params.id);

    return res.status(HttpStatus.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getAutoSuggestUsers = async (
  req: ValidatedRequest<GetAutoSuggestUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.getAutoSuggestUsers(
      req.query.login,
      req.query.limit
    );

    return res.status(HttpStatus.OK).json({ users });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: ValidatedRequest<CreateUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.create(req.body);

    return res.status(HttpStatus.CREATED).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: ValidatedRequest<UpdateUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserService.update(req.params.id, req.body);

    return res.status(HttpStatus.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: ValidatedRequest<DeleteUserSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.delete(req.params.id);

    return res.status(HttpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
