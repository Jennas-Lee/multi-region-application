export const databaseConfig: object = {
  development: {
    username: 'postgres',
    password: 'postgres12345678',
    database: 'postgres',
    host: '10.0.0.7',
    port: 5432,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.EXPRESS_DATABASE_DATABASE || 'postgres',
    password: process.env.EXPRESS_DATABASE_USERNAME || 'postgres12345678',
    database: process.env.EXPRESS_DATABASE_PASSWORD || 'postgres',
    host: process.env.EXPRESS_DATABASE_HOST || 'localhost',
    port: process.env.EXPRESS_DATABASE_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  'production': {
    database: process.env.EXPRESS_DATABASE_DATABASE,
    username: process.env.EXPRESS_DATABASE_USERNAME,
    password: process.env.EXPRESS_DATABASE_PASSWORD,
    replication: {
      read: [
        { host: process.env.EXPRESS_DATABASE_READ_HOST, },
      ],
      write: { host: process.env.EXPRESS_DATABASE_WRITE_HOST, },
    },
    port: process.env.EXPRESS_DATABASE_PORT,
    dialect: 'postgres',
    logging: false,
  },
}
