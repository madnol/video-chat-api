const socketio = require("socket.io");
// const cookieParser = require("socket.io-cookie-parser");
// const { verifyAccesToken } = require("./lib/auth/tokens");
// const vChatRoom = require("./Models/VideoChatRoomModel");

let users = {};

const socketToRoom = {};

const createSocketServer = server => {
  const io = socketio(server);

  io.on("connection", socket => {
    socket.on("join room", roomID => {
      if (users[roomID]) {
        console.log("room: ", roomID);

        const length = users[roomID].length;
        if (length === 4) {
          return;
        }
        users[roomID].push(socket.id);
      } else {
        users[roomID] = [socket.id];
      }
      socketToRoom[socket.id] = roomID;
      console.log(socketToRoom);
      const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

      socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
      io.to(payload.userToSignal).emit("user joined", {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on("returning signal", payload => {
      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on("disconnect", () => {
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter(id => id !== socket.id);
        users[roomID] = room;
      }

      socket.broadcast.emit("user left", socket.id);
    });
  });
};

module.exports = createSocketServer;
