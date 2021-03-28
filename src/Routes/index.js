const express = require("express");
const rootRouter = express.Router();

const userRouter = require("./users");

rootRouter.use("/users", userRouter);

module.exports = rootRouter;
