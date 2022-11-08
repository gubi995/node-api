import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../shared/config';
import { hashPassword } from '../../utils/auth';
import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
import { UserModel } from '../user/model';
import userService from '../user/service';
import { User } from '../user';
import { Login, Registration } from './type';

class AuthService {
  #generateToken(user: User) {
    return jwt.sign({ username: user.login }, config.get('auth.jwtSecret'), {
      expiresIn: '1h',
      subject: user.id,
    });
  }

  async login({ username, password }: Login) {
    const user = await UserModel.findOne({
      where: {
        login: username,
      },
    });

    if (!user) {
      throw new AppError({
        description: 'Incorrect username or password',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError({
        description: 'Incorrect username or password',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    return this.#generateToken(user);
  }

  async register(user: Registration) {
    const hashedPassword = await hashPassword(user.password);

    const newUser = await userService.create({
      ...user,
      password: hashedPassword,
    });

    return this.#generateToken(newUser);
  }
}

const authService = new AuthService();

export default authService;
