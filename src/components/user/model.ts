import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import db from '../../shared/db';

export default class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<string>;
  declare login: string;
  declare password: string;
  declare age: number;
  declare isDeleted: boolean;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 4, max: 130 },
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { sequelize: db, timestamps: true, tableName: 'users' }
);
