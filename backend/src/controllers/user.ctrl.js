const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET_CODE } = process.env;

const signup = async (req, res, next) => {
  res.json({
    message: req.authInfo,
    /* user: req.user, */
  });
};

const signin = async (req, res, next) => {
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

module.exports = {
  signin,
  signup,
  profile,
};
