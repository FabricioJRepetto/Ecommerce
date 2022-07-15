const { Router } = require("express");
const router = Router();
const {
  verifyToken,
  verifyEmailVerified,
  verifyAdmin,
  verifySuperAdmin,
  googleUserShallNotPass,
} = require("../middlewares/verify");
const passport = require("passport");
const {
  signin,
  signinGoogle,
  signup,
  profile,
  promoteUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  editProfile,
  verifyAdminRoute,
  getAllUsers,
  getAddressesAdmin,
  getOrdersAdmin,
  getWishlistAdmin,
  deleteUser,
} = require("../controllers/user.ctrl");
const addressRouter = require("./address.router");
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
      throw new Error("Passwords don't match");
    } else {
      return value;
    }
  });

const passwordValidationSignin = body("password", "Enter a valid password")
  .trim()
  .notEmpty()
  .escape();

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
router.post("/signinGoogle", signinGoogle);
router.get("/profile/:token", verifyToken, profile);
router.put("/verifyEmail", [verifyToken, googleUserShallNotPass], verifyEmail);
router.put("/forgotPassword", googleUserShallNotPass, forgotPassword);
router.put("/resetPassword", googleUserShallNotPass, resetPassword);
router.put(
  "/changePassword",
  [googleUserShallNotPass, passwordValidation],
  changePassword
);
router.put("/editProfile", [verifyToken, googleUserShallNotPass], editProfile);

router.put(
  "/promote/:id",
  [verifyToken, googleUserShallNotPass, verifyAdmin],
  promoteUser
);
router.get(
  "/verifyAdmin",
  [verifyToken, googleUserShallNotPass, verifyAdmin],
  verifyAdminRoute
);
router.get(
  "/getAll",
  [verifyToken, googleUserShallNotPass, verifyAdmin],
  getAllUsers
);
router.post(
  "/getAddressesAdmin",
  [verifyToken, googleUserShallNotPass, verifyAdmin],
  getAddressesAdmin
);
router.post(
  "/getOrdersAdmin",
  [verifyToken, googleUserShallNotPass, verifyAdmin],
  getOrdersAdmin
);
router.post(
  "/getWishlistAdmin",
  [verifyToken, googleUserShallNotPass, verifyAdmin],
  getWishlistAdmin
);

router.delete(
  "/:id",
  [verifyToken, googleUserShallNotPass, verifyAdmin],
  deleteUser
);

module.exports = router;
