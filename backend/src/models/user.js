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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  firstName: String,
  lastName: String,
  address: [{
    zip_code: String,
    street_name: String,
    street_number: Number,
  }],
  emailVerified: {
    type: Boolean,
    default: false,
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
