const passport = require("passport");
const User = require("../models/user");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const { JWT_SECRET_CODE } = process.env;

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.exists({ email });
        if (!user) {
          const newUser = await User.create({
            email,
            password,
          });
          const message = "Signup successfully";
          return done(null, newUser, message);
        } else {
          const message = "Email already registered";
          return done(null, user, message);
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  "signin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validity = await user.comparePassword(password);
        if (!validity) {
          return done(null, false, { message: "Wrong password" });
        }

        return done(null, user, { message: "Sign in successfully" });
      } catch (e) {
        return done(e);
      }
    }
  )
);
