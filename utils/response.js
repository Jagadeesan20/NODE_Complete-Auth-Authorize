const { StatusCodes } = require("http-status-codes");

class Response {
  constructor(response, status = 200) {
    this.response = response;
    this.status = status;
  }

  _ErrorMessage(message, error) {
    if (!this.status) {
      this.status = StatusCodes.BAD_REQUEST;
    }
    this.response.status(this.status).send({
      status: false,
      message: message,
      error: error,
    });
  }

  _LoginResponse(user, token) {
    this.response.status(this.status).send({
      status: true,
      message: "Login success !!",
      data: user,
      token: token,
    });
  }

  _SuccessResponse(message, data) {
    this.response.status(this.status).send({
      status: true,
      message: message,
      data: data,
    });
  }
  _SuccessResponseForCart(message, data) {
    if (data) {
      this.response.status(this.status).send({
        status: true,
        message: message,
        data: data,
      });
    } else {
      this.response.status(this.status).send({
        status: true,
        message: message,
        data: [],
      });
    }
  }
  _ErrorMessageForCart(message, error) {
    if (!this.status) {
      this.status = StatusCodes.BAD_REQUEST;
    }
    this.response.status(this.status).send({
      status: false,
      message: message,
      data: [],
    });
  }
}

module.exports = Response;
