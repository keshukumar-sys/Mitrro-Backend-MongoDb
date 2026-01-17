const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Shipping info
    shippingDetails: {
      address1: { type: String, required: true },
      address2: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
      other: { type: String },
    },

    // Order items snapshot (so order is immutable if product changes later)
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String },
      },
    ],

    // Payment details
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentId: { type: String }, // e.g., Razorpay / Stripe transaction ID

    // Order status
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    orderDetails: {
      cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
      },
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
