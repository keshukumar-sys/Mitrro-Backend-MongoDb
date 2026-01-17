const express = require("express");
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    updateQuantityBy1
} = require("../controllers/cart-controller");

const isAuthenticated = require("../middlewares/isAuthenicated");

// Get logged-in user's cart
router.get("/", isAuthenticated, getCart);

// Add item to cart
router.post("/add", isAuthenticated, addToCart);

// Update item quantity
router.put("/update", isAuthenticated, updateCartItem);

// Remove single item from cart
router.delete("/remove/:productId", isAuthenticated, removeFromCart);

// Clear entire cart (optional but useful)
router.delete("/clear", isAuthenticated, clearCart);


router.put("/updateQuantity" , isAuthenticated ,updateQuantityBy1);
module.exports = router;
