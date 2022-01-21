require("dotenv").config();

var winston = require("winston");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;

const appPath = process.env.APP_BASE_PATH;

var logger = new winston.createLogger({
  format: combine(
    label({ label: process.env.APP_NAME }),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      json: true,
      colorize: true,
    }),
    new winston.transports.File({
      filename: `${appPath}/logs/error.log`,
      level: "error",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: true,
    }),
    new winston.transports.File({ filename: `${appPath}/logs/combined.log` }),
  ],
  exitOnError: true, //  exit on handled exceptions
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;
