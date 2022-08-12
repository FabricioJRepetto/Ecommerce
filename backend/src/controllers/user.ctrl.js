require("dotenv").config();
const { CLOUDINARY_CLOUD, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;
const cloudinary = require("cloudinary").v2;
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const fs = require("fs-extra");
const { JWT_SECRET_CODE } = process.env;
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const user = require("../models/user");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const signup = async (req, res, next) => {
  if (req.authInfo.error) return res.json(req.authInfo);

  const { _id, email } = req.user;
  const body = { _id, email };

  try {
    const verifyToken = jwt.sign({ user: body }, JWT_SECRET_CODE);

    const link = `http://localhost:3000/verify/${verifyToken}`;
    await sendEmail(email, "Verificar email", link); //!VOLVER A VER modificar url de localhost

    return res.json({
      message: req.authInfo,
    });
  } catch (error) {
    next(error);
  }
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
        const { _id, email, name, role, avatar, isGoogleUser } = user;

        if (role === "deleted")
          return res.status(401).json({ message: "Cuenta eliminada" });

        const body = { _id, email, role, isGoogleUser };

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
    }
  })(req, res, next);
};

const signinGoogle = async (req, res, next) => {
  const { sub, email, emailVerified, avatar, firstName, lastName } = req.body;
  try {
    const userFound = await User.findOne({ email: sub });
    if (!userFound) {
      const newGoogleUser = await User.create({
        email: sub,
        password: sub,
        googleEmail: email,
        emailVerified,
        avatar,
        firstName,
        lastName,
        username: firstName || email.split("@")[0],
        isGoogleUser: true,
      });
      return res.json(newGoogleUser);
    } else {
      if (emailVerified !== userFound.emailVerified) {
        userFound.emailVerified = emailVerified;
        await userFound.save();
      }
      return res.json({ name: userFound.name });
    }
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  const userId = req.body._id || req.user._id;
  try {
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    let aux = userFound;
    delete aux.password;

    return res.json(aux);
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { _id } = req.user;
  if (!_id) return res.status(401).send({ message: "ID de cuenta no enviado" });

  try {
    const userFound = await User.findById(_id);

    if (!userFound)
      return res.status(404).json({ message: "Cuenta no encontrada" });
    if (userFound.emailVerified)
      return res.status(400).json({ message: "Email ya verificado" });

    userFound.emailVerified = true;
    await userFound.save();

    return res.json({ message: "Email verificado con éxito" });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(401).send({ message: "Email requerido" });

  try {
    let userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(404).send({ message: "Cuenta no encontrada" });
    if (userFound.isGoogleUser) {
      return res.status(401).json({ message: "Cuenta no autorizada" });
    }

    const body = { _id: userFound._id, email: userFound.email };
    const resetToken = jwt.sign(
      { user: body },
      JWT_SECRET_CODE + userFound.password,
      { expiresIn: "15m" }
    );

    const link = `http://localhost:3000/reset/${body._id}/${resetToken}`;
    await sendEmail(userFound.email, "Reestablecer contraseña", link);

    return res.json({
      message: "Revisa tu email para reestablecer la contraseña",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { _id } = req.body;
  const authHeader = req.headers.authorization;

  if (!_id) return res.status(403).json({ message: "ID de cuenta no enviado" });
  if (!authHeader) return res.status(403).json({ message: "Token no enviado" });
  let resetToken = authHeader.split(" ")[1];

  try {
    const userFound = await User.findById(_id);
    if (!userFound)
      return res.status(404).json({ message: "Cuenta no encontrada" });
    if (userFound.isGoogleUser)
      return res.status(401).json({ message: "Cuenta no autorizada" });

    await jwt.verify(resetToken, JWT_SECRET_CODE + userFound.password);
    return res.send("ok");
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

  if (!authHeader) return res.status(403).json({ message: "Token no enviado" });
  let resetToken = authHeader.split(" ")[1];

  try {
    const userFound = await User.findById(_id);
    if (!userFound)
      return res.status(404).json({ message: "Cuenta no encontrada" });
    if (userFound.isGoogleUser)
      return res.status(401).json({ message: "Cuenta no autorizada" });

    await jwt.verify(resetToken, JWT_SECRET_CODE + userFound.password);

    userFound.password = password;
    await userFound.save();
    return res.json({ message: "Contraseña modificada con éxito" });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.errors.map((err) => err.msg);
    return res.json({ message, error: true }); //! VOLVER A VER agregar el error:true a los res.json
  }

  try {
    const { password, oldPassword } = req.body;

    const userFound = await User.findById(req.user._id);
    const validity = await userFound.comparePassword(oldPassword);
    if (!validity) {
      return res.json({ message: "Contraseña incorrecta" });
    }

    userFound.password = password;
    await userFound.save();
    return res.json({ message: "Contraseña modificada con éxito" });
  } catch (error) {
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const { username, name, lastname } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username: username || user.username,
        firstName: name || user.name,
        lastName: lastname || user.lastname,
      },
      { new: true }
    );
    console.log("user", user);

    return res.json({ message: "Editado con éxito", user });
  } catch (error) {
    next(error);
  }
};

const setAvatar = async (req, res, next) => {
  try {
    const { avatar } = await User.findById(req.user._id);
    avatar &&
      cloudinary.api.delete_resources([avatar.split("/").pop().split(".")[0]]);

    const data = await cloudinary.uploader.upload(req.files[0].path);

    await fs.unlink(req.files[0].path);

    //: actualizar y enviar link de nueva imagen
    await User.findByIdAndUpdate(req.user._id, { avatar: data.url });

    return res.json({ message: "Avatar actualizado", avatar: data.url });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signin,
  signinGoogle,
  signup,
  profile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updatePassword,
  editProfile,
  setAvatar,
};
