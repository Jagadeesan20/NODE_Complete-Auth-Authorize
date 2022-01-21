const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");
const QueryGenerator = require("../generators/query.generator");
// const { database } = require('../config/database');
// const { database }=require('../utils/database')
const database = require("../utils/database");
const logger = require("../utils/winston");
const TokenController = {
  async revokeToken({ token, ipAddress }) {
    const refreshToken = await this.getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    refreshToken.revoked_by_ip = ipAddress;
    delete refreshToken.id;
    delete refreshToken.token;
    delete refreshToken.user_id;
    delete refreshToken.created_at;
    delete refreshToken.expires;
    await database.connection.promise().query(
      QueryGenerator.update("refresh_tokens", refreshToken, {
        token,
      })
    );
  },

  async refreshToken({ token, ipAddress }) {
    try {
      database.beginTransaction();
      const refreshToken = await this.getRefreshToken(token);

      console.log(refreshToken);
      let jwtToken = this.generateJwtToken({
        user_id: refreshToken.user_id,
      });

      // console.log(refreshToken)

      const newRefreshToken = await this.generateRefreshToken(
        {
          user_id: refreshToken.user_id,
        },
        ipAddress
      );

      refreshToken.revoked = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      refreshToken.revoked_by_ip = ipAddress;
      refreshToken.replaced_by_token = newRefreshToken.refreshToken;
      delete refreshToken.id;
      delete refreshToken.token;
      // delete refreshToken.user_id
      delete refreshToken.created_at;
      delete refreshToken.expires;

      await database.connection.promise().query(
        QueryGenerator.update("refresh_tokens", refreshToken, {
          token,
        })
      );

      database.commit();
      console.log("refreshToken", refreshToken);
      // return basic details and tokens
      return {
        ...{
          data: {
            user_id: refreshToken.user_id,
          },
        },
        token: jwtToken,
        token_expires_at: moment
          .unix(jwt.decode(jwtToken).exp)
          .format("YYYY-MM-DD HH:mm:ss"),
        refreshToken: newRefreshToken.refreshToken,
        refreshToken_expires_at: newRefreshToken.expires,
      };
    } catch (err) {
      database.rollback();

      console.log(err);
    }
  },

  async getRefreshToken(token) {
    let [refreshToken] = await database.connection
      .promise()
      .query(
        QueryGenerator.format(
          `SELECT * FROM refresh_tokens WHERE token = ? AND revoked is null`,
          [token]
        )
      );
    console.log("getRefreshToken", refreshToken);
    refreshToken = refreshToken[0];

    if (
      !refreshToken ||
      refreshToken.revoked ||
      moment(refreshToken.expires).isBefore(new Date())
    )
      throw new Error("Invalid token");
    else return refreshToken;
  },

  generateJwtToken(user) {
    var options = {
      expiresIn: process.env.JWT_EXPIRE_TIME,
      issuer: process.env.JWT_ISSUER,
    };
    let secret = process.env.JWT_SECRET;
    return jwt.sign(user, secret, options);
  },
  // }

  async generateRefreshToken(user, ipAddress) {
    let refreshToken = crypto.randomBytes(40).toString("hex");
    let refresh = {
      user_id: user.user_id,
      token: refreshToken,
      expires: moment(Date.now()).add(31, "days").format("YYYY-MM-DD HH:mm:ss"),
      createdByIp: ipAddress,
    };

    // await database.connection.promise().query(QueryGenerator.insert("refresh_tokens", refresh))
    await database
      .promise()
      .query(QueryGenerator.insert("refresh_tokens", refresh));

    return { refreshToken, expires: refresh.expires };
  },

  setTokenCookie(res, { token, refreshToken }) {
    // create http only cookie with refresh token that expires in 10 mins
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(moment().add(31, "days")),
      overwrite: true,
    };

    res.cookie("refresh_token", refreshToken, cookieOptions);
    res.cookie("access_token", token, cookieOptions);
  },
};

module.exports = TokenController;
