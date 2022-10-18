import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';

import { GroupModel } from '../group/model';
import { UserModel } from '../user/model';

@Table({ timestamps: true, tableName: 'UserGroups' })
export class UserGroupModel extends Model {
  @ForeignKey(() => UserModel)
  @Column
  userId!: string;

  @ForeignKey(() => GroupModel)
  @Column
  groupId!: string;
}
