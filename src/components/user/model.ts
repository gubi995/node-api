import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Validate,
  BelongsToMany,
} from 'sequelize-typescript';

import { GroupModel } from '../group/model';
import { UserGroupModel } from '../user-group/model';
import { User } from './type';

@Table({ timestamps: true, tableName: 'Users' })
export class UserModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: User['id'];

  @AllowNull(false)
  @Column(DataType.STRING)
  login!: User['login'];

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: User['password'];

  @AllowNull(false)
  @Column(DataType.STRING)
  salt!: User['salt'];

  @AllowNull(false)
  @Validate({ min: 4, max: 130 })
  @Column(DataType.INTEGER)
  age!: User['age'];

  @AllowNull(false)
  @Validate({ min: 4, max: 130 })
  @Default(false)
  @Column(DataType.BOOLEAN)
  isDeleted!: User['isDeleted'];

  @BelongsToMany(() => GroupModel, () => UserGroupModel)
  groups!: Array<GroupModel & { UserGroup: UserGroupModel }>;
}
