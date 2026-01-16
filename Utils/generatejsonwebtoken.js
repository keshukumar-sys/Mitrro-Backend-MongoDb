const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

function generateJsonWebToken(payload, options = {}) {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1d", // 👈 1 day expiry
    ...options
  });
}

module.exports = generateJsonWebToken;
