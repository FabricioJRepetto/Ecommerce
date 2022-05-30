const { Router } = require("express");
const router = Router();
const verifyToken = require("../middlewares/verifyToken");
const passport = require("passport");
const {
  signin,
  signup,
  signout,
  profile,
} = require("../controllers/user.ctrl");

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  signup
);

router.post("/signin", signin);

router.get("/profile", verifyToken, profile);

module.exports = router;
