const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"]
    },

    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Please provide your password"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false 
    },

    phone:{
        type:String , 
        required:[true , "Please provide your phone number"],
        unique:true
    },

    role:{
        type:String,
        enum:["user" , "admin" , "uploader" ],
        default:"user"
    }

}, {
    timestamps:true
});

const UserModel = mongoose.model("User" , userSchema);
module.exports = UserModel;