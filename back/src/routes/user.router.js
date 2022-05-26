const { Router } = require("express");
const router = Router();
const verifyUser = require("../middlewares/verifyUser");
const {
  signin,
  signup,
  signout,
  profile,
} = require("../controllers/user.ctrl");

router.post("/signin", signin);

router.post("/signup", signup);

router.get("/signout", verifyUser, signout);

router.get("/profile", verifyUser, profile);

module.exports = router;
