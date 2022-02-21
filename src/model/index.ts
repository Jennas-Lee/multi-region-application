import { Sequelize } from 'sequelize';

const env: string = process.env.NODE_ENV || 'development';
const config = require('../config/database')['databaseConfig'][env];

export const sequelize: Sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
