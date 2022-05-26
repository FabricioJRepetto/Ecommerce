const User = require("../models/user");
const { body } = require("express-validator");
const { validationResult } = require("express-validator");

const signin = async (req, res, next) => {
  [
    body("email", "Invalid email").trim().notEmpty().escape(),
    //body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    //body("username", "Invalid username").trim().notEmpty().escape(),
    body("password", "Password must have 6 characters at least")
      .trim()
      // .isLength({ min: 6 })
      .escape(),
  ];
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
};

const signup = async (req, res, next) => {
  [
    body("email", "Invalid email").trim().notEmpty().escape(),
    //body("email", "Invalid email").trim().isEmail().normalizeEmail(),
    //body("username", "Invalid username").trim().notEmpty().escape(),
    body("password", "Password must have 6 characters at least")
      .trim()
      //  .isLength({ min: 6 })
      .escape(),
  ];
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.json(errors.array());

  try {
    let user = await User.findOne({ email });
    if (user) throw new Error("This email is already in use"); //!VOLVER A VER manejo de errores
    user = new User({ email, password });
    await user.save();
    res.json({ email });
    //! VOLVER A VER agregar redireccionamiento a /user/signin
  } catch (err) {
    res.json({ error: err.message });
  }
};

const signout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    console.log("sesion cerrada");
    //return res.redirect("/user/signin");
  });
};

const profile = (req, res, next) => {
  res.json({
    user: req.user,
  });
};

module.exports = {
  signin,
  signup,
  signout,
  profile,
};
