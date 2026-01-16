const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dboqp6td8",
  api_key: process.env.CLOUDINARY_API_KEY || "377263162619878",
  api_secret: process.env.CLOUDINARY_API_SECRET || "MQfggAFwhGRPUGFDb6aTgIh0-gs",
});

module.exports = cloudinary;
