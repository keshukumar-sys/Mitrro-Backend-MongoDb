const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
    },

    bulkPrice: [
      {
        minQty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
    },

    subcategory: {
      type: String,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        value: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],

    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reviewText: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },

    createdByRole: {
      type: String,
      enum: ["admin", "brand", "user"],
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false, // admin approval (important for brand marketplace)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
