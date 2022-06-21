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
  resetPassword,
  changePassword,
  editProfile,
} = require("../controllers/user.ctrl");
const addressRouter = require('./address.router');
const { body } = require("express-validator");

const emailValidation = body("email", "Enter a valid e-mail")
  .trim()
  .notEmpty()
  .isEmail()
  .escape();

const passwordValidation = body(
  "password",
  "Password must be 6 characters long at least"
)
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
  });

const passwordValidationSignin = body("password", "Enter a valid password")
  .trim()
  .notEmpty()
  .escape();

//? Address router
router.use('/address', verifyToken, addressRouter);


router.post(
  "/signup",
  [
    emailValidation,
    passwordValidation,
    passport.authenticate("signup", { session: false }),
  ],
  signup
);

router.post("/signin", [emailValidation, passwordValidationSignin], signin);

router.get("/profile/:token", verifyToken, profile);

router.put("/role", [verifyToken, verifySuperAdmin], role); //! VOLVER A VER mover a ruta de superadmin

router.put("/verifyEmail", verifyToken, verifyEmail);

router.put("/forgotPassword", forgotPassword);

router.put("/resetPassword", resetPassword);

router.put("/changePassword", passwordValidation, changePassword);

router.put("/editProfile", verifyToken, editProfile);

module.exports = router;
