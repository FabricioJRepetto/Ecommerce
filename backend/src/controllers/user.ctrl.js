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
  // await sendEmail(email, "Verify Email", link); //!VOLVER A VER crashea la app al intentar enviar email

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
        const { _id, email, name, role, avatar } = user;
        const body = { _id, email, role };

        const token = jwt.sign({ user: body }, JWT_SECRET_CODE, {
          expiresIn: 864000,
        });

        return res.json({
          token,
          user: { email, name, role, avatar },
        });
      });
    } catch (e) {
      return next(e);
      /* if (!errors.isEmpty()) {
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

                const theUser = await User.findOne({ email: user.email });

                const body = { _id: user._id, email: user.email };

                const token = jwt.sign({ user: body }, JWT_SECRET_CODE, {
                    expiresIn: 864000,
                });

                return res.json({
                    message: info.message,
                    avatar: theUser.avatar || null,
                    token,
                    user: { _id: user._id, email: user.email },
                });
            });
        } catch (e) {
            return next(e); */
    }
  })(req, res, next);
};

const profile = async (req, res, next) => {
  try {
    if (req.params.token.slice(0, 6) === "google")
      return res.json({ name: req.user.email });
    //if (req.params.token.slice(0, 6) === "google") return res.json(req.user);
    const { email, name, role, avatar } = await User.findById(req.user._id);
    return res.json({ email, name, role, avatar: avatar || null });
  } catch (error) {
    next(error);
  }
};

const promoteUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(403).json({ message: "No id provided" });
  try {
    const userFound = await User.findById(id);
    if (!userFound) return res.status(404).json({ message: "User not found" });
    userFound.role === "client" && (userFound.role = "admin");
    await userFound.save();
    return res.json({ message: "User promoted successfully" });
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
    let userFound = await User.findOne({ email });
    if (!userFound) return res.status(404).send({ message: "User not found" });

    const body = { _id: userFound._id, email: userFound.email };
    const resetToken = jwt.sign(
      { user: body },
      JWT_SECRET_CODE + userFound.password,
      { expiresIn: "15m" }
    );

    const link = `http://localhost:3000/reset/${body._id}/${resetToken}`;
    await sendEmail(userFound.email, "Reset Password", link);

    return res.json({ message: "Check your email to reset your password" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { _id } = req.body;
  const authHeader = req.headers.authorization;

  if (!_id) return res.status(403).json({ message: "No id provided" });
  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });
  let resetToken = authHeader.split(" ")[1];

  try {
    const userFound = await User.findById(_id);
    if (!userFound) return res.status(404).json({ message: "User not found" });

    await jwt.verify(resetToken, JWT_SECRET_CODE + userFound.password);
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

  const { password, _id } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });
  let resetToken = authHeader.split(" ")[1];

  try {
    const userFound = await User.findById(_id);
    if (!userFound) return res.status(404).json({ message: "User not found" });

    await jwt.verify(resetToken, JWT_SECRET_CODE + userFound.password);

    userFound.password = password;
    await userFound.save();
    return res.json({ message: "Password changed successfully" });
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

const verifyAdminRoute = (req, res, next) => {
  return res.send("ok");
};

const getAllUsers = async (req, res, next) => {
  console.log("----------entra");
  const allUsersFound = await User.find({
    email: "admin@admin.com",
  })
    //.populate("addresses", { address: 1, _id: 1 })
    .populate("orders", "status")
    .exec();
  /* .exec((err, address) => {
      console.log("------error", err);
      console.log("------address", address);
      return;
    }); */
  console.log("--------userFound", allUsersFound);

  const usefulData = [
    "_id",
    "email",
    "name",
    "role",
    "emailVerified",
    "avatar",
  ];
  let allUsers = [];
  for (const user of allUsersFound) {
    let newUser = {
      _id: "",
      email: "",
      name: "",
      role: "",
      emailVerified: "",
      avatar: "",
    };
    for (const key in user) {
      if (usefulData.includes(key)) {
        //console.log(key + " " + user[key]);
        newUser[key] = user[key];
      }
    }
    allUsers.push(newUser);
  }
  //console.log(allUsers);
  return res.json(allUsers);
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userFound = await User.findById(id);
    if (userFound.role === "admin")
      return res.status(401).json({ message: "Unauthorized" });
    //const { avatar: imgToDelete } = await User.findById(id);
    //! VOLVER A VER agregar estraegia para eliminar avatar de cloudinary
    await User.findByIdAndDelete(id);
    return res.status(204).json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signin,
  signup,
  profile,
  promoteUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  editProfile,
  verifyAdminRoute,
  getAllUsers,
  deleteUser,
};
