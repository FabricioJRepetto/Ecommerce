const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET_CODE } = process.env;
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  const { _id, email } = req.user;

  const body = { _id, email };
  const verifyToken = jwt.sign({ user: body }, JWT_SECRET_CODE);

  const link = `http://localhost:3000/verify/${verifyToken}`;
  await sendEmail(email, "Verify Email", link);

  return res.status(201).json({
    message: req.authInfo,
  });
};

const signin = async (req, res, next) => {
  const errors = validationResult(req);

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
          expiresIn: 864000,
        });

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
  const { email, role } = req.body;
  if (!email) return res.status(403).json({ message: "No email provided" });
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(404).json({ message: "User not found" });
    userFound.role = role;
    await userFound.save();
    return res.json({ message: "Role changed successfully" });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { _id } = req.user;
  if (!_id) return res.status(401).send({ message: "No user ID provided" });

  try {
    const userFound = await User.findById(_id);
    if (!userFound) return res.status(404).json({ message: "User not found" });
    userFound.emailVerified = true;
    await userFound.save();

    return res.status(204).json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(401).send({ message: "Email is required" });

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const body = { _id: user._id, email: user.email };
    const resetToken = jwt.sign({ user: body }, JWT_SECRET_CODE, {
      expiresIn: 86400,
    });

    const link = `http://localhost:3000/reset/${resetToken}`;
    await sendEmail(user.email, "Reset Password", link);

    return res.json({ message: "Check your email to reset your password" });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.errors.map((err) => err.msg);
    return res.json({ message });
  }

  const { password } = req.body;

  try {
    const userFound = await User.findById(req.user._id);
    if (!userFound) return res.status(404).json({ message: "User not found" });
    userFound.password = password;
    await userFound.save();
    return res.status(204).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  const dataAllowedToEdit = ["firstName", "lastName", "address"];
  const dataToEdit = Object.keys(req.body);
  try {
    const userToEdit = await User.findById(req.user._id);
    if (!userToEdit) return res.status(404).json({ message: "User not found" });
    for (const property of dataToEdit) {
      if (dataAllowedToEdit.includes(property))
        userToEdit[property] = req.body[property];
    }
    await userToEdit.save();
    return res.json({ userToEdit, message: "Edited successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signin,
  signup,
  profile,
  role,
  verifyEmail,
  forgotPassword,
  changePassword,
  editProfile,
};
