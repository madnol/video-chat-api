const cloudinary = require("./config");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//* multer setting
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "users",
  },
});

const parser = multer({ storage });

module.exports = parser;
