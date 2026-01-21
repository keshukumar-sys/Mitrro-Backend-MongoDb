const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview, 
  getTotalProducts
} = require("../controllers/product-controller");

const upload = require("../Utils/multer");
const isAuthenticated = require("../middlewares/isAuthenicated");
const isAuthorized = require("../middlewares/isAuthorized");
// const isBrand = require("../middlewares/isBrand");

// ===================
// PUBLIC ROUTES
// ===================

// Get all products
router.get("/", getAllProducts);
router.get("/total_products" , getTotalProducts);

// Get product by ID
router.get("/:id", getProductById);


// ===================
// PROTECTED ROUTES
// ===================

// Create product (admin / brand only)
router.post(
  "/",
  (req , res , next)=>{
    console.log("Request Body:", req.body);
    next();
  },
  isAuthenticated,
  isAuthorized,
  upload.array("images", 5),
  createProduct
);

// Update product (admin / brand owner)
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  upload.array("images", 5),
  updateProduct
);


// Delete product (admin / brand owner)
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized,
  deleteProduct
);

// Add review (logged-in users)
router.post(
  "/:id/review",
  isAuthenticated,
  addReview
);

router.post(
  "/:id/:reviewId",
  isAuthenticated,
  deleteReview
)

module.exports = router;
