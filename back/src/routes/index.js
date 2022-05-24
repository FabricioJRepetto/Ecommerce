const { Router } = require("express");
const router = Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user"); //!------------- EXPORT

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      //! VOLVER A VER ¿quitar else?
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});
router.get("/user", (req, res) => {
  res.send(req.user);
});

module.exports = router;
