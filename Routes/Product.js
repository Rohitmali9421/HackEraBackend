const express = require("express");
const { handleGetProducts, handleCreateProduct } = require("../Controllers/Product");
const { authenticateToken } = require("../Middlewares/Auth");
const { validateCreateProduct } = require("../Middlewares/Validation");
const FileUpload = require("../Middlewares/FileUpload");

const router = express.Router();
router.get("/product",handleGetProducts);
router.post("/product",authenticateToken,FileUpload,validateCreateProduct,handleCreateProduct);



module.exports = router;
