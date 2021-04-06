const { verifyAccessToken } = require("../../Lib/auth/tokens");
const mongoose = require("mongoose");
const userModel = require("../../Models/UserModel");

const authorizeUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodeToken = await verifyAccessToken(token);

    const findUser = await userModel.findOne({
      _id: decodeToken._id,
    });

    req.token = token;
    req.user = findUser;

    next();
  } catch (err) {
    const error = new Error("User not authenticated");
    error.code = 401;
    next(error);
  }
};

module.exports = authorizeUser;
