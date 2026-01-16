const mongoose = require('mongoose');
async function connectDb(url) {
    try {
        const conn = await mongoose.connect(url);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return false;
    }
}

module.exports = connectDb;
