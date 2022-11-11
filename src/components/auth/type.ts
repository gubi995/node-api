import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

import { User } from '../user';

export type Login = Pick<User, 'username' | 'password'>;

export type Registration = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export interface LoginSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Login;
}

export interface RegistrationSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Registration;
}
