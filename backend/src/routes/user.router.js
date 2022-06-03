const { Router } = require("express");
const router = Router();
const verifyToken = require("../middlewares/verifyToken");
const verifySuperAdmin = require("../middlewares/verifySuperAdmin");
const passport = require("passport");
const { signin, signup, profile, role } = require("../controllers/user.ctrl");

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  signup
);

router.post("/signin", signin);

router.get("/profile", verifyToken, profile);

router.put("/role", [verifyToken, verifySuperAdmin], role); //! VOLVER A VER mover a ruta de superadmin

module.exports = router;
