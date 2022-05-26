const { Router } = require("express");
const router = Router();
const verifyUser = require("../middlewares/verifyUser");
const { body } = require("express-validator");
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
  ],
  signup
);

router.get("/signout", /* verifyUser, */ signout);

router.get("/profile", verifyUser, profile);

module.exports = router;
