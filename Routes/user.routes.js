const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers, getUserById, updateUser, deleteUser, logout , createuploader , createBrand , getAllBrands, approveBrand, deleteBrand } = require("../controllers/user-controller");
const isAuthenticated = require("../middlewares/isAuthenicated");
const isAdmin = require("../middlewares/isAdmin.js");



router.post("/signup" , signup);
router.post("/login" , login);
router.post("/create-uploader" , isAuthenticated , isAdmin , createuploader);
router.post("/create-brand" , isAuthenticated  , createBrand);
router.get("/get-brands" ,isAuthenticated , isAdmin , getAllBrands);
router.post("/logout" , isAuthenticated , logout);
router.get("/", isAuthenticated, isAdmin, getAllUsers);
router.get("/:id", isAuthenticated, getUserById);
router.put("/:id", isAuthenticated, updateUser);
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);
router.put("/brand/approve" , isAuthenticated , isAdmin , approveBrand)
router.delete("/brand/:id" , isAuthenticated , isAdmin  , deleteBrand)

module.exports = router;