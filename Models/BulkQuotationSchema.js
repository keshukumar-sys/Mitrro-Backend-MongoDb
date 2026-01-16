const mongoose = require("mongoose");
const bulkPriceQuotationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"]
    },
    minQuantity:{
        type: Number,
        required: [true, "Minimum quantity is required"]
    },
    maxQuantity:{
        type: Number,
        required: [true, "Maximum quantity is required"]
    },
    additionalDetails:{
        type: String,
        default: ""
    },
    status:{
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
});
const BulkQuotationModel = mongoose.model("BulkQuotation", bulkPriceQuotationSchema);
module.exports = BulkQuotationModel;