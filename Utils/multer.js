const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Config/cloudinary.config");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mitrro/products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
