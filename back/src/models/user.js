const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  /* username: {
    type: String,
    required: true,
  }, */
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  const compare = await bcrypt.compare(candidatePassword, user.password);
  return compare;
};

module.exports = mongoose.model("User", UserSchema);
