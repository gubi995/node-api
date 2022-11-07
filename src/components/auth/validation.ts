import * as Joi from 'joi';

import { validator } from '../../shared/validator';
import {
  userSchema,
  loginValidation,
  passwordValidation,
} from '../user/validation';

const loginSchema = Joi.object({
  username: loginValidation,
  password: passwordValidation,
});

export const loginPayloadValidation = [validator.body(loginSchema)];

export const registrationPayloadValidation = [validator.body(userSchema)];
