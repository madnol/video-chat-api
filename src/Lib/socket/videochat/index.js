const RoomModel = require("../../../Models/GroupModel");
const UserModel = require("../../../Models/UserModel");

const findRoomsByPartecipants = async id => {
  try {
    const rooms = await RoomModel.find({ users: { $in: [id] } }).populate({
      path: "users",
    });
    return rooms;
  } catch (error) {
    return null;
  }
};

module.exports = { findRoomsByPartecipants };
