var express = require("express");
const app = require("../app");
const FileUpload = require("../utils/file");
const { Auth, Authorize } = require("../utils/authenticate");
const { Roles } = require("../utils/Roles");

const userController = require("../controllers/user.controller");
var router = express.Router();

router.post(
  "/signup",

  FileUpload.base64ToImage("user_img", "user_img"),
  userController.signup
);

router.post("/login", userController.userLogin);
router.get("/users", Auth, Authorize([Roles.Admin]), userController.getAllUser);

// router.get('/filter',Authentication.Auth,userController.userFilter)

module.exports = router;
