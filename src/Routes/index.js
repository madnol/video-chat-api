const express = require("express");
const rootRouter = express.Router();
// const groupRouter = require("./GroupRooms");
const userRouter = require("./users");
const authRouter = require("./auth");

rootRouter.use("/users", userRouter);
// rootRouter.use("/auth", authRouter);

// rootRouter.use("/groups", groupRouter);

module.exports = rootRouter;
