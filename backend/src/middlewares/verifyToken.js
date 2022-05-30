const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const { JWT_SECRET_CODE } = process.env;

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) res.status(403).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const userDecoded = jwt.verify(token, JWT_SECRET_CODE);
    req.user = userDecoded.user;

    const userFound = await User.findById(req.user._id);
    if (!userFound) return res.status(404).json({ message: "No user found" });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/* async function isAdmin(req, res, next) {
  const id = req.user._id;
  const user = await Users.findById(id);
  if (user.role === "admin") {
    next();
  } else {
    res.sendStatus(401);
  }
}

module.exports = {
  verifyToken,
  isAdmin,
}; */
