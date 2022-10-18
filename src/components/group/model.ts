import {
  Table,
  PrimaryKey,
  Default,
  DataType,
  Column,
  AllowNull,
  Model,
  BelongsToMany,
} from 'sequelize-typescript';

import { UserGroupModel } from '../user-group/model';
import { UserModel } from '../user/model';
import { Group } from './type';

@Table({ timestamps: true, tableName: 'Groups' })
export class GroupModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: Group['id'];

  @AllowNull(false)
  @Column(DataType.STRING)
  name!: Group['name'];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  permissions!: Group['permissions'];

  @BelongsToMany(() => UserModel, () => UserGroupModel)
  users!: Array<UserModel & { UserGroup: UserGroupModel }>;
}
