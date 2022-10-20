import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

import { User } from '../user';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type Group = {
  id: string;
  name: string;
  permissions: Array<Permission>;
  createdAt?: string;
  updatedAt?: string;
};

export interface GetByIdRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: Group['id'];
  };
}

export interface CreateGroupSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Group;
}

export interface UpdateGroupSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Omit<Group, 'id'>;
  [ContainerTypes.Params]: {
    id: Group['id'];
  };
}

export interface DeleteGroupSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: Group['id'];
  };
}

export interface AddUsersToGroupSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: Group['id'];
  };
  [ContainerTypes.Body]: {
    userIds: Array<User['id']>;
  };
}
