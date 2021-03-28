const UserRouter = require("express").Router();

//*Controllers
const { GetAllUsers } = require("../../Controllers/userController");

UserRouter.get(
  "/",

  GetAllUsers
);

module.exports = UserRouter;
