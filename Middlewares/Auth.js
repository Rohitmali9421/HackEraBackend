const { getUser } = require("../Services/Auth");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ msg: "Please login" });
  
    const user = getUser(token);
    if (!user) return res.json({ msg: "invalid Token" });
    req.user = user;
    next();
  };
  module.exports={
    authenticateToken,
  }