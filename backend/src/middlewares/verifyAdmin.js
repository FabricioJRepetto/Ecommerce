const User = require("../models/user");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.role === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
