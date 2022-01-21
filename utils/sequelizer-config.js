require("dotenv").config();

module.exports = {
  local: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      bigNumberStrings: true,
    },
    // Use a different storage. Default: none
    // seederStorage: "json",
    // Use a different file name. Default: sequelize-data.json
    // seederStoragePath: "SequelizeSeed",
    // Use a different table name. Default: SequelizeData
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeed",
    // Use a different storage type. Default: sequelize
    // migrationStorage: "json",
    // Use a different file name. Default: sequelize-meta.json
    // migrationStoragePath: "sequelize_migration_log.json",
    // Use a different table name. Default: SequelizeMeta
    migrationStorageTableName: "SequelizeMeta",
  },
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      bigNumberStrings: true,
    },
    // Use a different storage. Default: none
    // seederStorage: "json",
    // Use a different file name. Default: sequelize-data.json
    // seederStoragePath: "SequelizeSeed",
    // Use a different table name. Default: SequelizeData
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeed",
    // Use a different storage type. Default: sequelize
    // migrationStorage: "json",
    // Use a different file name. Default: sequelize-meta.json
    // migrationStoragePath: "sequelize_migration_log.json",
    // Use a different table name. Default: SequelizeMeta
    migrationStorageTableName: "SequelizeMeta",
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      bigNumberStrings: true,
    },
    // Use a different storage. Default: none
    // seederStorage: "json",
    // Use a different file name. Default: sequelize-data.json
    // seederStoragePath: "SequelizeSeed",
    // Use a different table name. Default: SequelizeData
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeed",
    // Use a different storage type. Default: sequelize
    // migrationStorage: "json",
    // Use a different file name. Default: sequelize-meta.json
    // migrationStoragePath: "sequelize_migration_log.json",
    // Use a different table name. Default: SequelizeMeta
    migrationStorageTableName: "SequelizeMeta",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      bigNumberStrings: true,
    },
    // Use a different storage. Default: none
    // seederStorage: "json",
    // Use a different file name. Default: sequelize-data.json
    // seederStoragePath: "SequelizeSeed",
    // Use a different table name. Default: SequelizeData
    seederStorage: "sequelize",
    seederStorageTableName: "SequelizeSeed",
    // Use a different storage type. Default: sequelize
    // migrationStorage: "json",
    // Use a different file name. Default: sequelize-meta.json
    // migrationStoragePath: "sequelize_migration_log.json",
    // Use a different table name. Default: SequelizeMeta
    migrationStorageTableName: "SequelizeMeta",
  },
  // development: {
  //   username: "root",
  //   password: "Skein@123",
  //   database: "sample",
  //   host: "localhost",
  //   dialect: "mysql",
  // },
};
