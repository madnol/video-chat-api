const { Schema, model } = require("mongoose");

const GroupRoomSchema = new Schema(
  {
    name: String,
    users: [{ type: Schema.Types.ObjectId, ref: "users" }],
    lockedRoom: Boolean,
  },
  { timestamps: true }
);

module.exports = model("GroupRooms", GroupRoomSchema);
