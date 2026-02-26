const BulkQuotationModel = require("../Models/BulkQuotationSchema");

// ================= CREATE BULK QUOTATION =================
async function createBulkQuotation(req, res) {
    const { minQuantity, maxQuantity, additionalDetails } = req.body;
    const userId = req.user.id; // From auth middleware
    const { productId } = req.params;

    if (!minQuantity || !maxQuantity) {
        return res.status(400).json({ message: "Minimum and maximum quantities are required" });
    }

    try {
        const newQuotation = await BulkQuotationModel.create({
            userId,
            productId,
            minQuantity,
            maxQuantity,
            additionalDetails
        });

        return res.status(201).json({
            message: "Bulk quotation request created successfully",
            quotation: newQuotation
        });
    } catch (error) {
        console.error("Error creating bulk quotation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ================= GET ALL QUOTATIONS (user only) =================
async function getAllQuotations(req, res) {
    const userId = req.user.id;

    try {
        const quotations = (await BulkQuotationModel.find({ userId }).populate("productId", "name price"));
        return res.status(200).json({ quotations });
    } catch (error) {
        console.error("Error fetching quotations:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ================= GET SINGLE QUOTATION =================
async function getQuotation(req, res) {
    const { quotationId } = req.params;
    const userId = req.user.id;

    try {
        const quotation = await BulkQuotationModel.findOne({ _id: quotationId, userId }).populate("productId", "name price");
        
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        return res.status(200).json({ quotation });
    } catch (error) {
        console.error("Error fetching quotation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ================= UPDATE QUOTATION =================
async function updateQuotation(req, res) {
    const { quotationId } = req.params;
    const userId = req.user.id;
    const updates = req.body; // { minQuantity, maxQuantity, additionalDetails }

    try {
        const updatedQuotation = await BulkQuotationModel.findOneAndUpdate(
            { _id: quotationId, userId },
            { $set: updates },
            { new: true }
        );

        if (!updatedQuotation) {
            return res.status(404).json({ message: "Quotation not found or not authorized" });
        }

        return res.status(200).json({
            message: "Quotation updated successfully",
            quotation: updatedQuotation
        });
    } catch (error) {
        console.error("Error updating quotation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ================= DELETE QUOTATION =================
async function deleteQuotation(req, res) {
    const { quotationId } = req.params;
    const userId = req.user.id;

    try {
        const deletedQuotation = await BulkQuotationModel.findOneAndDelete({ _id: quotationId, userId });

        if (!deletedQuotation) {
            return res.status(404).json({ message: "Quotation not found or not authorized" });
        }

        return res.status(200).json({ message: "Quotation deleted successfully" });
    } catch (error) {
        console.error("Error deleting quotation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
// ================= GET ALL QUOTATIONS (ADMIN) =================
async function getAllQuotationsAdmin(req, res) {
    try {
        // Optional: add query filters
        const { productId, userId, status } = req.query;

        // Build dynamic query
        const query = {};
        if (productId) query.productId = productId;
        if (userId) query.userId = userId;
        if (status) query.status = status; // if you have statuses like "pending", "approved"

        // Fetch all quotations, populate user and product info
        const quotations = await BulkQuotationModel.find(query)
            .populate("userId", "name email")      // user info
            .populate("productId", "name price");  // product info

        return res.status(200).json({
            total: quotations.length,
            quotations
        });
    } catch (error) {
        console.error("Error fetching quotations for admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// ================= EXPORT =================
module.exports = {
    createBulkQuotation,
    getAllQuotations,
    getQuotation,
    updateQuotation,
    deleteQuotation, getAllQuotationsAdmin
};
