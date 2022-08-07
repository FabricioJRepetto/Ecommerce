const passport = require("passport");
const User = require("../models/user");
const localStrategy = require("passport-local").Strategy;
const { validationResult } = require("express-validator");
require("dotenv").config();

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          const message = errors.errors.map((err) => err.msg);
          return done(null, email, { message });
        }

        const user = await User.exists({ email });
        if (!user) {
          const newUser = await User.create({
            email,
            password,
            isGoogleUser: false,
          });
          return done(null, newUser, {
            message:
              "Cuenta creada con éxito, revisa tu email para verificar tu cuenta",
          });
        } else {
          return done(null, user, {
            message: "Email ya registrado",
            error: true,
          });
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
          return done(null, false, { message: "Cuenta no encontrada" });
        }

        const validity = await user.comparePassword(password);
        if (!validity) {
          return done(null, false, { message: "Password incorrecto" });
        }

        return done(null, user, { message: "Sesión iniciada con éxito" });
      } catch (e) {
        return done(e);
      }
    }
  )
);
