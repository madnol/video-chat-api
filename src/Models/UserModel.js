const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    profileImg: String,
    email: {
      type: String,
      // trim: true,
      // lowercase: true,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please, enter a valid email",
      ],
      unique: true,
    },
    password: { type: String },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    privateMode: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
    },
    // studyGroup: [{ type: Schema.types.ObjectId, ref: "studyGroups" }],
    // classes: [{ type: Schema.types.ObjectId, ref: "classes" }],
    Contacts: [{ type: Schema.Types.ObjectId, ref: "users" }],
    refreshToken: String,
    socketId: { type: String },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.googleId;
        delete ret.__v;
        return ret;
      },
    },
    timestamps: true,
  }
);

UserSchema.methods.comparePass = async function (pass) {
  try {
    const isValid = await bcrypt.compare(pass, this.password);
    return isValid;
  } catch (err) {
    console.log(err);
    return false;
  }
};

UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    const plainPassword = user.password;

    if (user.isModified("password")) {
      user.password = await bcrypt.hash(plainPassword, 10);
    }
    next();
  } catch (error) {
    console.log("Pre Save error!", error);
  }
});

module.exports = model("users", UserSchema);
