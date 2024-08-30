const express = require("express");
const { handleGetProducts, handleCreateProduct } = require("../Controllers/Product");
const { authenticateToken } = require("../Middlewares/Auth");
const { handleRecommendation } = require("../Services/Recommendation");

const router = express.Router();
router.get("/product",handleGetProducts);
router.post("/product",handleCreateProduct);
router.post("/recommend",handleRecommendation)


module.exports = router;
