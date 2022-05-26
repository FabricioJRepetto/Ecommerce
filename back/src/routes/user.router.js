const { Router } = require("express");
const router = Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");
const verifyUser = require("../middlewares/verifyUser");

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
  async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.array());
    }

    try {
      const user = await User.findOne({ email: email });
      if (!user) throw new Error("Invalid email or password");
      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) throw new Error("Invalid email or password");
      req.login(user, function (err) {
        if (err) throw new Error("Error at create a session");
        //return res.redirect("/"); //! VOLVER A VER redireccionamiento no funca
        return res.send("shiiii forkyyy");
      });
    } catch (err) {
      return res.json({ error: err.message });
    }
  }
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

  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors.array());

    try {
      let user = await User.findOne({ email });
      if (user) throw new Error("This email is already in use");
      user = new User({ email, password });
      await user.save();
      res.json(user);
      //! VOLVER A VER agregar redireccionamiento a /user/signin
    } catch (err) {
      res.json({ error: err.message });
    }
  }
);

router.get("/profile", verifyUser, (req, res, next) => {
  res.json({
    message: "You did it!",
    user: req.user,
  });
});

module.exports = router;
