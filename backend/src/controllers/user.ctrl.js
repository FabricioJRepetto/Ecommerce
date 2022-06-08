const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET_CODE } = process.env;
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");

const signup = async (req, res, next) => {
  res.json({
    message: req.authInfo,
    /* user: req.user, */
  });
};

const signin = async (req, res, next) => {
  const errors = validationResult(req);

  console.log("-----------------ENTRA");
  if (!errors.isEmpty()) {
    const message = errors.errors.map((err) => err.msg);
    return res.json({ message });
  }

  passport.authenticate("signin", async (err, user, info) => {
    try {
      if (err || !user) throw new Error(info.message);
      //const error = new Error(info);
      //return next(info);

      req.login(user, { session: false }, async (err) => {
        if (err) return next(err);
        const body = { _id: user._id, email: user.email };

        const token = jwt.sign({ user: body }, JWT_SECRET_CODE, {
          expiresIn: 86400,
        });

        console.log(user);
        return res.json({
          message: info.message,
          token,
          user: { _id: user._id, email: user.email },
        });
      });
    } catch (e) {
      return next(e);
    }
  })(req, res, next);
};

const profile = (req, res, next) => {
  res.json({
    user: req.user,
  });
};

const role = async (req, res, next) => {
  try {
    const userFound = await User.findByIdAndUpdate(
      req.user._id,
      {
        role: req.body.role,
      },
      { new: true }
    );
    if (!userFound) return res.status(404).json({ message: "No user found" });
    return res.send(userFound);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signin,
  signup,
  profile,
  role,
};
