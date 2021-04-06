const express = require("express");
const rootRouter = express.Router();
// const groupRouter = require("./GroupRooms");
const userRouter = require("./users");

rootRouter.use("/users", userRouter);
// rootRouter.use("/groups", groupRouter);

module.exports = rootRouter;
