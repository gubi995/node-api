import * as Joi from 'joi';

import { validator } from '../../shared/validator';
import {
  userSchema,
  usernameValidation,
  passwordValidation,
} from '../user/validation';

const loginSchema = Joi.object({
  username: usernameValidation,
  password: passwordValidation,
});

export const loginPayloadValidation = [validator.body(loginSchema)];

export const registrationPayloadValidation = [validator.body(userSchema)];
