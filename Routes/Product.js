const express = require("express");
const { handleGetProducts, handleCreateProduct } = require("../Controllers/Product");
const { authenticateToken } = require("../Middlewares/Auth");

const router = express.Router();
router.get("/product",handleGetProducts);
router.post("/product",handleCreateProduct);



module.exports = router;
