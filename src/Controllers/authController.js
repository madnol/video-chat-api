const UserModel = require("../Models/UserModel");
const mongoose = require("mongoose");

const { generateCookies, deleteCookies } = require("../Lib/auth/cookies");

const { generateTokens, verifyAccessToken } = require("../lib/auth/tokens");

const passport = require("passport");

const { FE_URI } = process.env;

exports.loginController = async (req, res, next) => {
  try {
    console.log("ok");
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    console.log(user);

    if (!user) throw error;

    if (user) {
      const isValid = await user.comparePass(password);
      console.log(isValid);

      const tokens = await generateTokens(user);

      if (!tokens) throw error;
      else {
        const cookies = await generateCookies(tokens, res);
        res.send(tokens);
      }
    }
  } catch (error) {
    console.log("loginController ERROR!", error);
  }
};

exports.refreshTokenController = async (req, res, next) => {
  try {
    const user = await verifyAccessToken(req);

    if (!user) throw error;

    const tokens = await generateTokens(user);

    if (!tokens) throw error;

    const cookies = await generateCookies(tokens, res);
    res.send(tokens);
  } catch (error) {
    console.log("RefreshTokenController ERROR!", error);
    next(error);
  }
};

exports.logoutController = async (req, res, next) => {
  try {
    const clearCookies = await deleteCookies(res);
    res.redirect(`${FE_URI}`);
  } catch (error) {
    console.log("logoutController ERROR", error);
    next(error);
  }
};

//*OAUTH

//Callback Google
exports.callbackGoogle = async (req, res, next) => {
  try {
    console.log(req.user);
    const { tokens } = req.user;
    const cookies = await generateCookies(tokens, res);

    //Verify credentials
    res.redirect(FE_URI);
  } catch (error) {
    console.log("callbackGoole ERROR", error);
    next(error);
  }
};