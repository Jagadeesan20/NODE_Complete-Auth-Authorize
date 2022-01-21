var express = require("express");
const app = require("../app");

// router instance
var router = express.Router();

const userRouter = require("./user.routes");

router.use("/user", userRouter);

module.exports = router;
