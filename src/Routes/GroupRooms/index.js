const groupRoomsRouter = require("express").Router();
const uuid = require("uuid");
const {
  getAllRooms,
  createRoom,
  getSingleRoom,
  leaveTheRoom,
} = require("../../Controllers/roomController");
const authorizeUser = require("../../Middlewares/auth/index");

//*All the rooms
groupRoomsRouter.get("/", authorizeUser, getAllRooms);

//*Single room
groupRoomsRouter.get("/data/:roomId", authorizeUser, getSingleRoom);

//*Create a new room
groupRoomsRouter.post("/", authorizeUser, createRoom);

//*Leave room
groupRoomsRouter.put("/:roomId/leaveroom", authorizeUser, leaveTheRoom);

console.log("all good");
module.exports = groupRoomsRouter;
