const express = require("express");
const router = express.Router();



const { validateCreateProduct } = require("../Middlewares/Validation");
const FileUpload = require("../Middlewares/FileUpload");
const { handleGetProduct, handleCreateProduct, handleDeleteProduct, handleUpdateProduct } = require("../Controllers/Product");

router
  .route("/products")
  .get(handleGetProduct)
  .post(FileUpload, validateCreateProduct, handleCreateProduct);

router
  .route("/products/:id")
  .delete(handleDeleteProduct)
  .put(handleUpdateProduct);

module.exports = router;
