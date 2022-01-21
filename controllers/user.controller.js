const userModel = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const QueryGenerator = require("../generators/query.generator");
const SpErrorHandler = require("../utils/error-handler");
const { Message } = require("../utils/messages");
const Response = require("../utils/response");
const { response } = require("../app");
const jwt = require("jsonwebtoken");
const TokenController = require("./token.controller");

const userController = {
  async signup(req, res) {
    // console.log(req.body)
    let { role_id, first_name, last_name, phone_no, user_email, password } =
      req.body;
    try {
      let [user] = await userModel.addUser({
        role_id,
        first_name,
        last_name,
        phone_no,
        user_email,
        password,
      });
      if (user) {
        new Response(res, StatusCodes.OK)._SuccessResponse(
          Message.UserManagement.SuccessMessage.Create
        );
      } else {
        new Response(res, StatusCodes.BAD_REQUEST)._ErrorMessage(
          Message.UserManagement.FailureMessage.Create
        );
      }
    } catch (err) {
      /**
       * Handling err response
       */
      new SpErrorHandler(res, err);
      console.log(err);
    }
  },
  async getAllUser(rer, res) {
    try {
      let [Members] = await userModel.getMembers();
      if (Members.length) {
        new Response(res, StatusCodes.OK)._SuccessResponse(
          Message.UserManagement.SuccessMessage.fetch,
          Members
        );
      } else {
        new Response(res, StatusCodes.BAD_REQUEST)._ErrorMessage(
          Message.UserManagement.FailureMessage.fetch
        );
      }
    } catch (err) {
      /**
       * Handling err response
       */
      new SpErrorHandler(res, err);
      console.log(err);
    }
  },
  //   async getIndividualUser(req, res) {
  //     let { id } = req.params;
  //     try {
  //       let [individualUser] = await userModel.getUserById(id);
  //       if (individualUser.length) {
  //         new Response(res, StatusCodes.OK)._SuccessResponse(
  //           Message.UserManagement.SuccessMessage.fetch,
  //           individualUser
  //         );
  //       } else {
  //         new Response(res, StatusCodes.BAD_REQUEST)._ErrorMessage(
  //           Message.UserManagement.FailureMessage.fetch
  //         );
  //       }
  //     } catch (err) {
  //       /**
  //        * Handling err response
  //        */
  //       new SpErrorHandler(res, err);
  //       console.log(err);
  //     }
  //   },
  //   async updateMembers(req, res) {
  //     let { id } = req.params;
  //     let {
  //       name,
  //       age,
  //       phone_no,
  //       email,
  //       profile_img,
  //       user_name,
  //       password,
  //       blood_group,
  //       address,
  //     } = req.body;
  //     try {
  //       let [updatedUser] = await userModel.updateUserById(id, {
  //         name,
  //         age,
  //         phone_no,
  //         email,
  //         profile_img,
  //         user_name,
  //         password,
  //         blood_group,
  //         address,
  //       });
  //       if (updatedUser.affectedRows) {
  //         new Response(res, StatusCodes.OK)._SuccessResponse(
  //           Message.UserManagement.SuccessMessage.Update
  //         );
  //       } else {
  //         new Response(res, StatusCodes.BAD_REQUEST)._ErrorMessage(
  //           Message.UserManagement.FailureMessage.Update
  //         );
  //       }
  //     } catch (err) {
  //       /**
  //        * Handling err response
  //        */
  //       new SpErrorHandler(res, err);
  //       console.log(err);
  //     }
  //   },
  //   async deleteMember(req, res) {
  //     let { id } = req.params;

  //     let [useDeleted] = await userModel.deleteUserById(id);
  //     if (useDeleted.affectedRows) {
  //       new Response(res, StatusCodes.BAD_REQUEST)._SuccessResponse(
  //         Message.UserManagement.SuccessMessage.Delete
  //       );
  //     } else {
  //       new Response(res, StatusCodes.BAD_REQUEST)._ErrorMessage(
  //         Message.UserManagement.FailureMessage.Delete
  //       );
  //     }
  //   },
  async userLogin(req, res) {
    try {
      let { user_email, password } = req.body;

      let [userDetails] = await userModel.findUser({ user_email, password });
      console.log(userDetails);
      if (userDetails.length) {
        let payload = {
          role_id: userDetails[0].role_id,
          user_id: userDetails[0].user_id,
          user_email: userDetails[0].user_email,
          password: userDetails[0].password,
        };
        console.log(payload);
        let options = {
          expiresIn: process.env.JWT_EXPIRE_TIME,
          issuer: process.env.JWT_ISSUER,
        };
        let secret = process.env.JSON_WEB_TOKEN_SECRET;
        let token = jwt.sign(payload, secret, options);
        let refreshToken = await TokenController.generateRefreshToken(
          payload,
          req.ip
        );
        console.log(token);

        /** Set cookie  */

        TokenController.setTokenCookie(res, {
          token,
          refreshToken: refreshToken.refreshToken,
        });

        res.send({
          user_id: userDetails[0].id,
          role_id: userDetails[0].role_id,
          status: true,
          token,
          refreshToken,
        });
      } else {
        res.send({
          status: false,
          message: "Invalid user,Please Enter valid username and password !",
        });
      }
    } catch (err) {
      /**
       * Handling err response
       */
      new SpErrorHandler(res, err);
    }
  },
  // async userFilter(req,res){
  //     console.log('Controller Testing');
  //     try{
  //         let{
  //             user_name
  //         }=req.query

  //         console.log(user_name)

  //         let [userName]=await userModel.userFilterByName(user_name);
  //         if(userName.length){
  //             new Response(
  //                 res,
  //                 StatusCodes.OK
  //             )._SuccessResponse(
  //                 Message.UserManagement.SuccessMessage.filter,
  //                 userName
  //             )
  //         }
  //         else{
  //             new Response(
  //                 res,
  //                 StatusCodes.BAD_REQUEST
  //             )._ErrorMessage(
  //                 Message.UserManagement.FailureMessage.filter

  //             )

  //         }
  //     }
  //     catch(err){
  //         /**
  //          * Handling err response
  //          */
  //          new SpErrorHandler(res, err)

  //     }
  // }
};

module.exports = userController;
