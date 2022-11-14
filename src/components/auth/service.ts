import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../../shared/config';
import { HttpStatus } from '../../types/http-status';
import { AppError } from '../../shared/error';
import { User } from '../user';

class AuthService {
  generateToken(user: User) {
    return jwt.sign({ username: user.username }, config.get('auth.jwtSecret'), {
      expiresIn: '1h',
      subject: user.id,
    });
  }

  async checkIfPasswordValid(receivedPassword: string, userPassword: string) {
    const isValidPassword = await bcrypt.compare(
      receivedPassword,
      userPassword
    );

    if (!isValidPassword) {
      throw new AppError({
        description: 'Incorrect username or password',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  hashPassword(password: string) {
    const rounds = 12;

    return bcrypt.hash(password, rounds);
  }
}

const authService = new AuthService();

export default authService;
