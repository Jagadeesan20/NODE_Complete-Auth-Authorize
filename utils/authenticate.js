const { StatusCodes } = require("http-status-codes");
var passport = require("passport");
// const { database } = require('../config/database');
const database = require("./database");
const QueryGenerator = require("../generators/query.generator");
const TokenController = require("../controllers/token.controller");
var jwt = require("jsonwebtoken");
require("dotenv").config;

function Auth(req, res, next) {
  try {
    console.log("req.headers.access_token ---> ", req.headers.jwt);

    let access_token = req.headers.jwt || null;
    let refresh_token =
      req.headers["x-refresh-token"] || req.cookies.refresh_token || null;

    console.log("Acess------->", access_token);
    if (!access_token) {
      res.status(StatusCodes.UNAUTHORIZED).send({
        status: false,
        message: "Unauthorized",
      });
    } else {
      let user = jwt.verify(
        access_token,
        process.env.JSON_WEB_TOKEN_SECRET,
        TokenController.options
      );

      if (user) {
        database
          .promise()
          .query(
            "SELECT * FROM refresh_tokens WHERE user_id = ? AND expires > NOW() AND revoked is null ",
            [user.user_id]
          )
          .then(([rfTokens]) => {
            if (rfTokens.length) {
              req.user = user;
              next();
            } else {
              res.send({
                status: false,
                message: "Invalid token !",
              });
            }
          });
      } else {
        res.send({
          status: false,
          message: "Invalid token !",
        });
      }
    }
  } catch (err) {
    console.log("Unauthorized catch err...", err);
    res.send({
      status: false,
      message: "Unauthorized !",
      err: err,
    });
  }
}
function Authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }
  return [
    // authenticate JWT token and attach user to request object (req.user)
    // authorize based on user role
    (req, res, next) => {
      let role_id = req.user.role_id != null ? req.user.role_id.toString() : "";
      if (roles.length && !roles.includes(role_id)) {
        // user's role is not authorized
        return res.status(401).send({
          status: false,
          message: "You have no access to access this url !",
        });
      }
      next();
      // authentication and authorization successful
    },
  ];
}

module.exports = { Auth, Authorize };
