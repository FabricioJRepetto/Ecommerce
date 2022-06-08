const { Router } = require("express");
const router = Router();
const verifyToken = require("../middlewares/verifyToken");
const verifySuperAdmin = require("../middlewares/verifySuperAdmin");
const passport = require("passport");
const { signin, signup, profile, role } = require("../controllers/user.ctrl");
const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("email", "Enter a valid e-mail")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body("password", "Password must be 6 characters long at least")
      .trim()
      .notEmpty()
      .isLength({ min: 8 })
      .escape(),
    passport.authenticate("signup", { session: false }),
  ],
  signup
);

router.post(
  "/signin",
  [
    body("email", "Enter a valid e-mail")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .escape(),
    body("password", "Enter a valid password").trim().notEmpty().escape(),
  ],
  signin
);

router.get("/profile", verifyToken, profile);

router.put("/role", [verifyToken, verifySuperAdmin], role); //! VOLVER A VER mover a ruta de superadmin

module.exports = router;
