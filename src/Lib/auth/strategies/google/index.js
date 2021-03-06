const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const UserModel = require("../../../../Models/UserModel");
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_ID, BE_URI, FE_URI } = process.env;
const { generateTokens } = require("../../tokens");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET_ID,
      callbackURL: `${BE_URI}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const { email, given_name, family_name, picture } = profile._json;

        const user = await UserModel.findOne({ email });

        if (!user) {
          //register the user
          const newUser = new UserModel({
            name: given_name,
            lastname: family_name,
            imageUrl: picture,
            email,
            googleId: profile.id,
            username: email,
          });
          const savedUser = await newUser.save();
          const tokens = await generateTokens(savedUser);
          done(undefined, { user: savedUser, tokens });
        } else {
          //generate token
          const tokens = await generateTokens(user);
          console.log(tokens);
          done(undefined, { user, tokens });
        }
      } catch (err) {
        console.log(err);
        done(err, undefined);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
