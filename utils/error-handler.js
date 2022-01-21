const { TooManyRequests, HttpError } = require("http-errors");
const database = require("./database");
const { Message } = require("./messages");
const logger = require("./winston");

const { StatusCodes } = require("http-status-codes");
const Response = require("./response");

/**  Global error handlers */
class SpErrorHandler {
  /**
   *
   * @param {*} response // response instance
   * @param {*} error // Error type
   */
  constructor(response, error = null) {
    let mysql_server_error_codes = [
      "ECONNREFUSED",
      "ER_BAD_DB_ERROR",
      "PROTOCOL_CONNECTION_LOST",
      "ER_PARSE_ERROR",
      "ER_NO_SUCH_TABLE",
    ];

    let mysql_reference_error_codes = ["ER_NO_REFERENCED_ROW_2"];

    let mysql_duplication_error_codes = [
      "ER_DUP_ENTRY",
      "SequelizeUniqueConstraintError",
    ];

    // if error already defined it
    logger.info(error);
    if (typeof error == "string") {
      // setting status as a bad request and sending error message
      new Response(response, StatusCodes.BAD_REQUEST)._ErrorMessage(error);
    }

    // if error is an instance of Js Error instance
    else if (error instanceof Error) {
      // Database error instance if connection lost or protocol error
      if (mysql_server_error_codes.includes(error.code)) {
        this.dbLog(error);
        new Response(response, StatusCodes.INTERNAL_SERVER_ERROR)._ErrorMessage(
          Message.Common.FailureMessage.InternalServerError
        );
      }

      // If child reference row not found
      else if (mysql_reference_error_codes.includes(error.code)) {
        this.dbLog(error);
        new Response(response, StatusCodes.NOT_FOUND)._ErrorMessage(
          Message.Common.FailureMessage.InvalidRef
        );
      }

      // If data already exists
      else if (
        mysql_duplication_error_codes.includes(error.code) ||
        mysql_duplication_error_codes.includes(error.name)
      ) {
        this.dbLog(error);
        new Response(response, StatusCodes.BAD_REQUEST)._ErrorMessage(
          Message.Common.FailureMessage.DataAlreadyExists
        );
      }

      // If invalid error found sending native message
      else {
        console.log(error);
        logger.info({
          message: error.message,
        });
        new Response(response, StatusCodes.BAD_REQUEST)._ErrorMessage(
          Message.Common.FailureMessage.InternalServerError
        );
      }
    } else {
      // If invalid error found sending native message

      console.log(error);
      logger.info({
        message: error.message,
      });
      new Response(response, StatusCodes.BAD_REQUEST)._ErrorMessage(
        Message.Common.FailureMessage.InternalServerError
      );
    }
  }

  dbLog(error) {
    logger.info({
      code: error.code,
      errno: error.errno,
      fatal: error.fatal,
      sql: error.sql,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });
  }
}

module.exports = SpErrorHandler;
