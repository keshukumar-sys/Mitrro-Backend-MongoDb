    const Order = require("../Models/orderSchema");
    const Cart = require("../Models/cartSchema");
    const Product = require("../Models/ProductSchema");

    // 1️⃣ Create Order from Cart
    async function createOrderFromCart(req, res) {
        const userId = req.user.id;
        const { shippingDetails, paymentMethod } = req.body;

        if (!shippingDetails || !shippingDetails.address1 || !shippingDetails.pincode) {
            return res.status(400).json({ message: "Shipping details are required" });
        }

        try {
            // Populate products to get price, title, stock
            const cart = await Cart.findOne({ userId }).populate("items.productId");
            if (!cart || cart.items.length === 0)
                return res.status(400).json({ message: "Cart is empty" });

            const orderItems = [];
            let totalPrice = 0;

            for (const item of cart.items) {
                const product = item.productId;
                if (!product) return res.status(400).json({ message: "Product not found" });

                if (product.stock < item.quantity)
                    return res.status(400).json({ message: `Insufficient stock for ${product.title}` });

                orderItems.push({
                    productId: product._id,
                    title: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    image: product.image || "",
                });

                totalPrice += product.price * item.quantity;
            }

            // Create the order
            const newOrder = new Order({
                userId,
                shippingDetails,
                items: orderItems,
                paymentMethod: paymentMethod || "COD",
                totalPrice,
                orderDetails: { cartId: cart._id },
            });
            await newOrder.save();

            // Reduce product stock
            const bulkUpdates = orderItems.map(item => ({
                updateOne: {
                    filter: { _id: item.productId },
                    update: { $inc: { stock: -item.quantity } },
                },
            }));
            await Product.bulkWrite(bulkUpdates);

            // Clear cart
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();

            res.status(201).json({ success: true, message: "Order created", order: newOrder });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // 2️⃣ Get all orders (Admin)
    async function getAllOrders(req, res) {
        try {
            const orders = await Order.find().populate("userId", "name email").populate("items.productId"); ;
            res.status(200).json({ success: true, orders });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // 3️⃣ Get single order
    async function getOrder(req, res) {
        const { id } = req.params;
        try {
            const order = await Order.findById(id).populate("userId", "name email");
            if (!order) return res.status(404).json({ message: "Order not found" });

            res.status(200).json({ success: true, order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // 4️⃣ Get logged-in user orders
    async function getUserOrders(req, res) {
        const userId = req.user.id;
        try {
            const orders = await Order.find({ userId });
            res.status(200).json({ success: true, orders });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // 5️⃣ Update order status (Admin)
    async function updateOrderStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        try {
            const order = await Order.findById(id);
            if (!order) return res.status(404).json({ message: "Order not found" });

            order.orderStatus = status;
            await order.save();

            res.status(200).json({ success: true, message: "Order status updated", order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
    async function updatePaymentStatus(req, res) {
    
        const { id } = req.params;

        const { status } = req.body;

        const validStatuses = ["Pending", "Paid", "Failed", "Refunded"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        try {
            const order = await Order.findById(id);
            if (!order) return res.status(404).json({ message: "Order not found" });

            order.paymentStatus = status;
            await order.save();

            res.status(200).json({ success: true, message: "Order status updated", order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // 6️⃣ Delete order (Admin)
    async function deleteOrder(req, res) {
        const { id } = req.params;
        try {
            const order = await Order.findByIdAndDelete(id);
            if (!order) return res.status(404).json({ message: "Order not found" });

            res.status(200).json({ success: true, message: "Order deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    module.exports = {
        createOrderFromCart,
        getAllOrders,
        getOrder,
        getUserOrders,
        updateOrderStatus,
        deleteOrder,
        updatePaymentStatus
    };
