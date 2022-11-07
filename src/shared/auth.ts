import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import {
  Strategy as JwtStrategy,
  StrategyOptions,
  ExtractJwt,
} from 'passport-jwt';

import { UserModel } from '../components/user/model';
import config from './config';
import { AppError } from './error';

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('auth.jwtSecret'),
};

passport.use(
  new JwtStrategy(options, async function verify(jwt, done) {
    try {
      const user = await UserModel.findByPk(jwt.sub);

      if (!user) {
        return done(null, false, {
          message: 'Incorrect username or password',
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  passport.authenticate(
    'jwt',
    {
      session: false,
    },
    (_err, _user, info) => {
      if (info instanceof Error) {
        throw new AppError({
          description: info.message,
          statusCode: 401,
        });
      }

      next();
    }
  )(req, res, next);
