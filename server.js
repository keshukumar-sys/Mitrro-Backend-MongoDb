const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

// Importing the internal modules
const connectDb = require("./Utils/connectDb");
const userRoutes = require("./Routes/user.routes");
const createAdmin = require("./Utils/createAdmin");
const productRoutes = require("./Routes/product.routes");
const bulkQuotationRoutes = require("./Routes/bulk-quotation.routes");
const categoryRoutes = require("./Routes/category.routes")
const cartRoutes = require("./Routes/cart-routes")
const orderRoutes = require("./Routes/order.routes");
// Importing the ENV variables
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Setting up middlewares and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.text());
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "https://mitrro-admin-panel-24um.vercel.app",
    "https://mitrro-admin-panel.vercel.app"
  ],
  credentials: true, // REQUIRED for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Sample route
app.get("/", (req,res)=>{
    console.log("Server is running");
    res.send("Server is running");
});
// setting up the routes
app.use("/api/users" , userRoutes);
app.use("/api/products" , productRoutes);
app.use("/api/bulk-quotations" , bulkQuotationRoutes);
app.use("/api/categories" , categoryRoutes);
app.use("/api/cart" ,cartRoutes );
app.use("/api/orders" , orderRoutes)
// Starting the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    // Connect to DB
    const isConnected = await connectDb(MONGO_URI);
    if (!isConnected) {
      console.error("Failed to connect to the database. Exiting...");
      process.exit(1);
    }

    // Create admin if not exists
    // await createAdmin();
    // console.log("Admin check/creation completed.");

  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
});
