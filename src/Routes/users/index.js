const UserRouter = require("express").Router();
const authorizeUser = require("../../Middlewares/auth");
const cloudinaryParser = require("../../lib/cloudinary/users");

//*Controllers
const {
  RegisterUser,
  UploadImage,
  SearchController,
  GetAllUsers,
  getMe,
  GetSingleUser,
} = require("../../Controllers/userController");

UserRouter.get("/register", RegisterUser);
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
// UserRouter.get("/:username", authorizeUser, GetSingleUser);

module.exports = UserRouter;
