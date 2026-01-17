const express = require("express");
const router = express.Router();

// Middlewares
const isAuthenticated = require("../middlewares/isAuthenicated");
const isAdmin = require("../middlewares/isAdmin"); 

// Order Controllers
const {
    createOrderFromCart,
    getAllOrders,
    getOrder,
    getUserOrders,
    updateOrderStatus,
    deleteOrder,
    updatePaymentStatus
} = require("../controllers/order-controller");

// =====================
// User routes
// =====================

// Checkout from cart
router.post("/checkout", isAuthenticated, createOrderFromCart);

// Get logged-in user's orders
router.get("/my-orders", isAuthenticated, getUserOrders);

// Get a single order (user can view their own)
router.get("/:id", isAuthenticated, getOrder);

// =====================
// Admin routes
// =====================

// Get all orders
router.get("/", isAuthenticated, isAdmin, getAllOrders);

// Update order status
router.put("/status/:id", isAuthenticated, isAdmin, updateOrderStatus);
router.put("/payment-status/:id" , isAuthenticated , isAdmin, updatePaymentStatus);
// Delete an order
router.delete("/:id", isAuthenticated, isAdmin, deleteOrder);

module.exports = router;
