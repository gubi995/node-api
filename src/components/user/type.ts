import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export type User = {
  id: string;
  username: string;
  password: string;
  age: number;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export interface GetByIdRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: User['id'];
  };
}

export interface GetAutoSuggestUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    limit: number;
    login: string;
  };
}

export interface CreateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: User;
}

export interface UpdateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<User, 'id'>;
  [ContainerTypes.Params]: {
    id: User['id'];
  };
}

export interface DeleteUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: User['id'];
  };
}
