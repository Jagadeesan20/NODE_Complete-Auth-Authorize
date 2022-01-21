var mysql = require("mysql2");

/**
 * Dot env configuration
 */
require("dotenv").config();

let database = mysql.createPool({
  // user: "root",
  // password: "Skein@123",
  // database: "sample",
  // host: "localhost",
  // port: 3306,
  // // multipleStatements: true,
  // // dateStrings: true,
  // //   DB_USER=root
  // // DB_PASS=Skein@123
  // // DB_NAME=sample
  // // DB_HOST=127.0.0.1
  // // DB_PORT=3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    bigNumberStrings: true,
  },

  connectionLimit: 1,
  // dateStrings: "DATETIME",
  connectTimeout: 20000,
});

module.exports = database;

module.exports.transactions = {
  async beginTransaction() {
    await database.promise().query("START TRANSACTION; SET AUTOCOMMIT = 0");
  },

  async commit() {
    await database.promise().query("COMMIT; SET AUTOCOMMIT = 1");
  },

  async rollback() {
    await database.promise().query("ROLLBACK; SET AUTOCOMMIT = 1");
  },
};
