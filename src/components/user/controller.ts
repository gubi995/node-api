import { Handler } from 'express';

import { HttpStatus } from '../../types/http-status';

import UserService from './service';

export const getUsers: Handler = async (req, res, next) => {
  try {
    const users = await UserService.getAll();

    return res.status(HttpStatus.OK).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserById: Handler = async (req, res, next) => {
  try {
    const user = await UserService.getById(req.params.id);

    return res.status(HttpStatus.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

export const createUser: Handler = async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);

    return res.status(HttpStatus.CREATED).json({ user });
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

export const updateUser: Handler = async (req, res, next) => {
  try {
    const user = await UserService.update(req.params.id, req.body);

    return res.status(HttpStatus.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: Handler = async (req, res, next) => {
  try {
    await UserService.delete(req.params.id);

    return res.status(HttpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
