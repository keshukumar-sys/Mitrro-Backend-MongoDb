const express = require("express");
const router = express.Router();

const {
    createCategory,
    getAllCategorires,
    updateCategory,
    deleteCategory
} = require("../controllers/category-controller")

const upload = require("../Utils/multer");
const isAuthenticated = require("../middlewares/isAuthenicated");
const isAuthorized = require("../middlewares/isAuthorized");
router.post(
    "/category",
    isAuthenticated,
    upload.single("categoryImage"),
    createCategory
);

router.get("/categories", getAllCategorires);

router.put(
    "/category/:id",
    isAuthenticated,
    upload.single("categoryImage"),
    updateCategory
);

router.delete("/category/:id", isAuthenticated, deleteCategory);

module.exports = router;
