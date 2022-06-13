const { Router } = require("express");
const router = Router();
const {
  verifyToken,
  verifyEmailVerified,
  verifyAdmin,
  verifySuperAdmin,
} = require("../middlewares/verify");
const passport = require("passport");
const {
  signin,
  signup,
  profile,
  role,
  verifyEmail,
  forgotPassword,
  changePassword,
  editProfile,
} = require("../controllers/user.ctrl");
const { body } = require("express-validator");

router.post(
  "/signup",
  [
    body("email", "Enter a valid e-mail").trim().notEmpty().isEmail().escape(),
    body("password", "Password must be 6 characters long at least")
      .trim()
      .notEmpty()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repPassword) {
          throw new Error("Passwords are not equal");
        } else {
          return value;
        }
      }),
    passport.authenticate("signup", { session: false }),
  ],
  signup
);

router.post(
  "/signin",
  [
    body("email", "Enter a valid e-mail").trim().notEmpty().isEmail().escape(),
    body("password", "Enter a valid password").trim().notEmpty().escape(),
  ],
  signin
);

router.get("/profile", verifyToken, profile);

router.put("/role", [verifyToken, verifySuperAdmin], role); //! VOLVER A VER mover a ruta de superadmin

router.put("/verifyEmail", verifyToken, verifyEmail);

router.put("/forgotPassword", forgotPassword);

router.put("/resetPassword", verifyToken, async (req, res, next) =>
  res.json({ message: "ok" })
);

router.put(
  "/changePassword",
  [
    verifyToken,
    body("password", "Password must be 6 characters long at least")
      .trim()
      .notEmpty()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repPassword) {
          throw new Error("Passwords are not equal");
        } else {
          return value;
        }
      }),
  ],
  changePassword
);

router.put("/editProfile", verifyToken, editProfile);

module.exports = router;
