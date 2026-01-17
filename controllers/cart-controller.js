const Cart = require("../Models/cartSchema");
const Product = require("../Models/ProductSchema"); // make sure this points to your Product model

// Helper function to calculate totalPrice
async function calculateTotalPrice(cart) {
    let total = 0;
    for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
}

async function addToCart(req, res) {
    const userId = req.user.id;
    let { productId, quantity = 1 } = req.body;
    quantity = parseInt(quantity);

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        // Update totalPrice
        cart.totalPrice = await calculateTotalPrice(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getCart(req, res) {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        // Ensure totalPrice is updated
        cart.totalPrice = await calculateTotalPrice(cart);
        await cart.save();

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function updateCartItem(req, res) {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.quantity = quantity;

        // Update totalPrice
        cart.totalPrice = await calculateTotalPrice(cart);
        await cart.save();

        res.status(200).json({ success: true, message: "Cart updated", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function removeFromCart(req, res) {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Update totalPrice
        cart.totalPrice = await calculateTotalPrice(cart);
        await cart.save();

        res.status(200).json({ success: true, message: "Item removed from cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function clearCart(req, res) {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = [];
        cart.totalPrice = 0; // reset totalPrice
        await cart.save();

        res.status(200).json({ success: true, message: "Cart cleared", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function updateQuantityBy1(req, res) {
    const userId = req.user.id;
    const { productId, action } = req.body; // action: "increment" | "decrement"

    if (!productId || !action) return res.status(400).json({ message: "Product ID and action are required" });

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        if (action === "increment") {
            item.quantity += 1;
        } else if (action === "decrement") {
            item.quantity = Math.max(item.quantity - 1, 1);
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }

        // Update totalPrice
        cart.totalPrice = await calculateTotalPrice(cart);
        await cart.save();

        res.status(200).json({ success: true, message: "Cart updated successfully", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    updateQuantityBy1
};
