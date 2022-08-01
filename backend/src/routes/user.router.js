const { Router } = require("express");
const router = Router();
const {
    verifyToken,
    verifyEmailVerified,
    googleUserShallNotPass,
} = require("../middlewares/verify");
const passport = require("passport");
const {
    signin,
    signinGoogle,
    signup,
    profile,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    editProfile,
    setAvatar,
} = require("../controllers/user.ctrl");
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
router.post("/avatar", verifyToken, setAvatar);
router.get("/profile/:token", verifyToken, profile);
router.put("/verifyEmail", [verifyToken, googleUserShallNotPass], verifyEmail);
router.put("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);
router.put("/changePassword", passwordValidation, changePassword);
router.put("/editProfile", [verifyToken, verifyEmailVerified], editProfile);
/*googleUserShallNotPass, */

module.exports = router;