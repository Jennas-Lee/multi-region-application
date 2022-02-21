import { DataTypes, Model } from 'sequelize';

import { sequelize } from './index';

export const userFactory = () => {
  class User extends Model {
    name!: string
    email!: string
    birth!: string
    password!: string
  }

  User.init({
    name: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    birth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    modelName: 'User',
    tableName: 'User',
    sequelize,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  });

  return User;
}
