const passport = require("passport");
const User = require("../models/user");

/* passport.serializeUser((user, done) => {
  done(null, { id: user._id, email: user.email });
});
passport.deserializeUser(async (user, done) => {
  const userDb = await User.findById(user.id);
  return done(null, { id: userDb._id, email: userDb.email });
}); */

const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { validationResult } = require("express-validator");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      /*       const errors = validationResult(req);
      if (!errors.isEmpty()) return res.done(null, false, errors.array()); //! VOLVER A VER ver si funca el array como tercer parametro */

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
      /*       const errors = validationResult(req);
      if (!errors.isEmpty()) return res.done(null, false, errors.array()); //! VOLVER A VER ver si funca el array como tercer parametro */

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
/* 
passport.use(
  new JWTStrategy(
    {
      secretOrKey: "top_secret",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (e) {
        done(error);
      }
    }
  )
);
 */
