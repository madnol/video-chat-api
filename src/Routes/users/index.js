const UserRouter = require("express").Router();
const authorizeUser = require("../../Middlewares/auth");
const cloudinaryParser = require("../../Lib/cloudinary/users");

const schemas = require("../../Lib/validation/validationSchema");
const validationMiddleware = require("../../Lib/validation/validationMiddleware");

console.log({ cloudinaryParser });
//*Controllers
const {
  RegisterUser,
  UploadImage,
  SearchController,
  GetAllUsers,
  getMe,
  GetSingleUser,
} = require("../../Controllers/userController");

UserRouter.post(
  "/register",
  validationMiddleware(schemas.userSchema),
  RegisterUser
);
UserRouter.post(
  "/upload",
  authorizeUser,
  cloudinaryParser.single("image"),
  UploadImage
);
UserRouter.get("/me", authorizeUser, getMe);
UserRouter.get("/search", authorizeUser, SearchController);
UserRouter.get("/", authorizeUser, GetAllUsers);
// UserRouter.get("/:username", authorizeUser, GetSingleUser);

module.exports = UserRouter;
