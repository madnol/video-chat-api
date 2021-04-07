const roomModel = require("../Models/GroupModel");
const mongoose = require("mongoose");

const { findRoomsByPartecipants } = require("../lib/socket/videochat");

//Error Handling
const ApiError = require("../Lib/ApiError");

//*GET ROOMS OF THE USER
exports.getAllRooms = async (req, res, next) => {
  try {
    const { _id } = req.user;
    console.log("room", _id);
    const rooms = findRoomsByPartecipants(_id);
    res.status(200).send({ rooms });
  } catch (error) {
    console.log("getAllRooms ERROR", error);
    next(error);
  }
};

//*GET SINGLE ROOM
exports.getSingleRoom = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const { roomId } = req.params;
    console.log(roomId);
    const room = await roomModel.findById(roomId);

    const roomparticipants = room.users.map(user => user._id);
    if (room && roomparticipants.includes(_id)) {
      res.status(200).send({ room });
    } else throw Error;
  } catch (err) {
    console.log("allRooms err", err);
    err.code = 404;
    next(err);
  }
};

//*CREATE ROOM
exports.createRoom = async (req, res, next) => {
  try {
    const { users, roomName } = req.body;
    console.log(users);

    if (users.length < 0) throw Error;
    const RoomDetails = {
      name: roomName,
      users: [req.user._id, ...users],
    };

    const duplicateRoom = await roomModel.find({
      users: { $all: RoomDetails.users },
      name: RoomDetails.name,
    });

    console.log("duplicate: ", duplicateRoom);
    if (!duplicateRoom.length) {
      const newRoom = new roomModel(RoomDetails);
      const savedRoom = newRoom.save();
      res.status(201).send({ room: savedRoom });
    } else {
      res.status({ room: duplicateRoom });
    }
  } catch (error) {
    console.log("createRoom ERROR", error);
    next(error);
  }
};

//*LEAVE THE ROOM
exports.leaveTheRoom = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { roomId } = req.params;
    const Room = await roomModel.findByIdAndUpdate(
      roomId,
      {
        $pull: { users: _id },
      },
      { runValidators: true, new: true }
    );
    if (Room.users.length == 0) await roomModel.findByIdAndDelete(roomId);

    res.status(200).send(Room ? { Room } : "The room has been deleted");
  } catch (error) {
    console.log("allRooms ERROR", error);
    next(error);
  }
};
