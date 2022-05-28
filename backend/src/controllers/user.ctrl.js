const User = require("../models/user");
const { validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const signin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors.array());

  /* const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid email or password");
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) throw new Error("Invalid email or password");
    req.login(user, function (err) {
      if (err) throw new Error("Error at create a session");
      //return res.redirect("/"); //! VOLVER A VER redireccionamiento no funca
      return res.send("Sign in successfully");
    });
  } catch (err) {
    return res.json({ error: err.message });
  } */

  passport.authenticate("signin", async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(err);
        const error = new Error(err);
        return next(error);
      }

      req.login(user, { session: false }, async (err) => {
        if (err) return next(err);
        const body = { _id: user._id, email: user.email };

        const token = jwt.sign({ user: body }, "top_secret");
        return res.json({ token });
      });
    } catch (e) {
      return next(e);
    }
  })(req, res, next);
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors.array());

  /* const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) throw new Error("This email is already in use"); //!VOLVER A VER manejo de errores
    user = new User({ email, password });
    await user.save();
    res.json({ email });
  } catch (err) {
    res.json({ error: err.message });
  } */

  res.json({
    message: "Signup successful",
    user: req.user,
  });
};

const signout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    console.log("sesion cerrada");
    req.user = null;
    delete req.user;
    if (req.session) {
      req.session.destroy(function () {
        console.log("Destroyed");
        res.clearCookie("connect.sid");
      });
    }
    res.status(200).clearCookie("connect.sid", { path: "/" });
  });
};

const profile = (req, res, next) => {
  res.json({
    message: "You did it!",
    user: req.user,
    token: req.query.secret_token,
  });
};

module.exports = {
  signin,
  signup,
  signout,
  profile,
};
