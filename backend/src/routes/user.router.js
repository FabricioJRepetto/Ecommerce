const { Router } = require("express");
const router = Router();
const verifyToken = require("../middlewares/verifyToken");
const { body } = require("express-validator");
const passport = require("passport");
const {
  signin,
  signup,
  signout,
  profile,
} = require("../controllers/user.ctrl");

router.post(
  "/signin",
  [
    body("email", "Invalid email").trim().notEmpty().escape(),
    //body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    //body("username", "Invalid username").trim().notEmpty().escape(),
    body("password", "Password must have 6 characters at least")
      .trim()
      // .isLength({ min: 6 })
      .escape(),
  ],
  signin
);

router.post(
  "/signup",
  [
    body("email", "Invalid email").trim().notEmpty().escape(),
    //body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    //body("username", "Invalid username").trim().notEmpty().escape(),
    body("password", "Password must have 6 characters at least")
      .trim()
      //  .isLength({ min: 6 })
      .escape(),
    passport.authenticate("signup", { session: false }),
  ],
  signup
);

router.delete("/signout", /* verifyToken, */ signout);

router.get(
  "/profile",
  verifyToken /* passport.authenticate("jwt", { session: false }) */,
  profile
);

module.exports = router;
