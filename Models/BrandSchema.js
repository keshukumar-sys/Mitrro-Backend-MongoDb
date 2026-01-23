const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
    },
    email: {
        type: String,
        required: [true, "Brand email is required"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Brand phone number is required"],
        unique: true
    },
    licenseNumber: {
        type: String,
        required: [true, "Brand license number is required"],
        unique: true
    },
    address: {
        street: {
            type: String,
            required: [true, "Street is required"]
        },
        city: {
            type: String,
            required: [true, "City is required"]
        },
        state: {
            type: String,
            required: [true, "State is required"]
        },
        postalCode: {
            type: String,
            required: [true, "Postal code is required"]
        },
        country: {
            type: String,
            default:"India",
            required: [true, "Country is required"]
        }
     },
    password: {
        type: String,
        required: [true, "Brand password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["brand"],
        default: "brand"
    },
    status:{
        type:Boolean,
        default:false

    }
}, {
    timestamps: true
});


const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;