const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true // one cart per user
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ],
        totalPrice:{
            type:Number,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
