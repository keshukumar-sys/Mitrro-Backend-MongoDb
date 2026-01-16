const bcrypt = require("bcryptjs");
async function comparePassword(plainPassword , hashedPassword) {
    return await bcrypt.compare(plainPassword , hashedPassword);
}

module.exports = comparePassword;