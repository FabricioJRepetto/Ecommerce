/* module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.send("unauthorized king");
}; */

const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "top_secret", (err, user) => {
      console.log(user.user);
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user.user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
