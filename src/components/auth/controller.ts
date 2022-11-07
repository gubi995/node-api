import { NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { HttpStatus } from '../../types/http-status';
import authService from './service';
import { LoginSchema, RegistrationSchema } from './type';

class AuthController {
  async login(
    req: ValidatedRequest<LoginSchema>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = await authService.login(req.body);

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
      const token = await authService.register(req.body);

      return res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

export default authController;
