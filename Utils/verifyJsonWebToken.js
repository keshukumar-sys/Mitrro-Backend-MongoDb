const jwt = require("jsonwebtoken");
async function verifyJsonWebToken(token) {

    const secretKey = process.env.SECRET_KEY || "your_default_secret_key";

    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
}

module.exports = { verifyJsonWebToken };