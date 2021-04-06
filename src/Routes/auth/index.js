const authRoutes = require("express").Router();
const validate = require("../../lib/validation/validationMiddleware");
const loginSchema = require("../../lib/validation/validationSchema")
  .loginSchema;
const passport = require("passport");
const {
  loginController,
  logoutController,
  refreshTokenController,
} = require("../../Controllers/authController");

const { FE_URI } = process.env;

const { generateCookies } = require("../../lib/auth/cookies");

authRoutes.post("/login", validate(loginSchema), loginController);
authRoutes.post("/refresh", refreshTokenController);
authRoutes.post("/logout", logoutController);

//*OAUTH

//Login Google
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      console.log(req.user);
      const { tokens } = req.user;
      const cookies = await generateCookies(tokens, res);
      //verify credentials
      res.redirect(FE_URI);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

//Login Facebook
authRoutes.post("/facebook");
authRoutes.post("/facebook/callback");

module.exports = authRoutes;