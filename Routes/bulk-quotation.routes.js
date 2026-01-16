const express = require("express");
const router = express.Router();

const {
  createBulkQuotation,
  getAllQuotations,
  getQuotation,
  updateQuotation,
  deleteQuotation,
  getAllQuotationsAdmin
} = require("../controllers/bulk-quotation-controller");

const isAuthenticated = require("../middlewares/isAuthenicated");
const isAdmin = require("../middlewares/isAdmin");


// ================= USER ROUTES =================

// Create a bulk quotation
router.post("/create/:productId", isAuthenticated, createBulkQuotation);

// Get all quotations of logged-in user
router.get("/my-quotations", isAuthenticated, getAllQuotations);

// Get a single quotation by ID
router.get("/:quotationId", isAuthenticated, getQuotation);

// Update a quotation
router.put("/:quotationId", isAuthenticated, updateQuotation);

// Delete a quotation
router.delete("/:quotationId", isAuthenticated,  deleteQuotation);


// ================= ADMIN ROUTES =================

// Get all quotations (with optional filters)
router.get("/admin/all", isAuthenticated, isAdmin, getAllQuotationsAdmin);

module.exports = router;
