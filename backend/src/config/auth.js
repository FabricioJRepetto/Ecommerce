const passport = require("passport");
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, { id: user._id, email: user.email });
});
passport.deserializeUser(async (user, done) => {
  const userDb = await User.findById(user.id);
  return done(null, { id: userDb._id, email: userDb.email });
});
