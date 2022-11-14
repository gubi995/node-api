import { NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
import userService from '../user/service';
import authService from './service';
import { LoginSchema, RegistrationSchema } from './type';

class AuthController {
  async getUserByUsername(username: string) {
    try {
      return await userService.getByField({ username });
    } catch (error) {
      if (
        error instanceof AppError &&
        error.statusCode === HttpStatus.NOT_FOUND
      ) {
        throw new AppError({
          description: 'Incorrect username or password',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      throw error;
    }
  }

  async login(
    req: ValidatedRequest<LoginSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username, password } = req.body;

      const user = await this.getUserByUsername(username);

      authService.checkIfPasswordValid(password, user.password);

      const token = authService.generateToken(user);

      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: ValidatedRequest<RegistrationSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const hashedPassword = await authService.hashPassword(req.body.password);

      const newUser = await userService.create({
        ...req.body,
        password: hashedPassword,
      });

      const token = authService.generateToken(newUser);

      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

export default authController;
