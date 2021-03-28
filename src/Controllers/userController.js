const UserModel = require("../Models/UserModel");
const mongoose = require("mongoose");

//*USERS
exports.GetAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    if (users) {
      res.status(200).send(users);
    } else throw new Error();
  } catch (error) {
    console.log("GetAllUsers ERROR", error);
    next(error);
  }
};
