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

exports.GetSingleUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    console.log(username);
    const user = await UserModel.findOne({ username: username }).populate(
      "Contacts"
    );

    if (user) {
      res.status(200).send({ user });
    } else throw new Error("user not found!");
  } catch (error) {
    console.log("GetSingleUser ERROR", error);
    next(error);
  }
};

exports.RegisterUser = async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(_id);
    console.log("Succesfully registered!");
  } catch (error) {
    console.log("RegisterUser ERROR", error);
    next(error);
  }
};

exports.UploadImage = async (req, res, next) => {
  console.log(req.user);
  const { _id } = req.user;
  try {
    const image = req.file && req.file.path;
    const editedUser = await UserModel.findByIdAndUpdate(
      _id,
      { $set: { profileImg: image } },
      { runValidators: true, new: true }
    );
    res.status(201).send({ editedUser });
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.SearchController = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      username: new RegExp(req.query.q, "i"),
    });
    console.log(user);
    res.status(200).send({ user });
  } catch (error) {
    console.log("There is no user with this id!", error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const currentUser = await UserModel.findById(_id).populate("Contacts");
    console.log(currentUser);
    if (!currentUser) throw error;
    res.status(200).send({ currentUser });
  } catch (error) {
    console.log("GetMe error", error);
    err.code = 401;
    next(error);
  }
};

exports.putMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const editedUser = await UserModel.findById(_id);

    if (editedUser._id != _id)
      throw new ApiError(401, "Only the owner of this profile can edit");
    const updatedProfile = await UserModel.findByIdAndUpdate(_id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(200).json({ updatedProfile });
  } catch (error) {
    console.log("putMe ERROR", error);
    next(error);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const deletedUser = await UserModel.findByIdAndDelete(_id);
    if (deletedUser) res.status(200).send(` deleted ${deletedUser} account`);
    const err = new Error("User not found");
    err.httpStatusCode = 404;
    next(err);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.AddContact = async (req, res, next) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;
    if (!(await UserModel.findById(contactId)))
      return next(new Error("The user you are trying to add does not exist!"));

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { Contacts: contactId },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
  } catch (error) {
    console.log("The user you are trying to add does not exist!", error);
    next(error);
  }
};
