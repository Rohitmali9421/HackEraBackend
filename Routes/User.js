const express = require("express");
const { handleLogin, handleSignUp, handleUpdateUser, handlecheck } = require("../Controllers/User");
const { validateLogin, validateSignUp } = require("../Middlewares/Validation");
const FileUpload = require("../Middlewares/FileUpload");
const { authenticateToken } = require("../Middlewares/Auth");

const router = express.Router();
router.get("/",handlecheck)
router.post("/login",validateLogin,handleLogin);
router.post("/signup", validateSignUp, handleSignUp);
router.post("/update",authenticateToken,FileUpload,handleUpdateUser );

module.exports = router;
