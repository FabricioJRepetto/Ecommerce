const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET_CODE } = process.env;
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
                const { _id, email, name, role, avatar, isGoogleUser } = user;

                if (role === "deleted")
                    return res.status(401).json({ message: "User deleted" });

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
                isGoogleUser: true,
            });
            return res.json(newGoogleUser);
        } else {
            if (emailVerified !== userFound.emailVerified)
                userFound.emailVerified = emailVerified;
            if (avatar !== userFound.avatar) userFound.avatar = avatar;
            if (firstName !== userFound.firstName) userFound.firstName = firstName;
            if (lastName !== userFound.lastName) userFound.lastName = lastName;
            await userFound.save();
            return res.send("ok");
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
            return res.status(404).json({ message: "User not Found" });
        }
        const {
            email,
            name,
            role,
            avatar,
            emailVerified,
            isGoogleUser,
            googleEmail,
        } = userFound;

        return res.json(userFound);
        return res.json({
            email,
            name,
            //! VOLVER A VER agregar emailVerified y googleEmail
            role,
            emailVerified,
            isGoogleUser,
            googleEmail,
            avatar: avatar || null,
        });
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
        if (userFound.isGoogleUser) {
            return res.status(401).json({ message: "Google user unauthorized" });
        }

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
        if (userFound.isGoogleUser)
            return res.status(401).json({ message: "Google user unauthorized" });

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
        if (userFound.isGoogleUser)
            return res.status(401).json({ message: "Google user unauthorized" });

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
//! VOLVER A VER separar addAddress de editProfile, los users de google no pueden editar el perfil, pero SI agregar address

module.exports = {
    signin,
    signinGoogle,
    signup,
    profile,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    editProfile,
};
