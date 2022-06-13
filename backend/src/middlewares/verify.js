const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const { JWT_SECRET_CODE, OAUTH_CLIENT_ID } = process.env;
const { OAuth2Client } = require("google-auth-library");

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(403).json({ message: "No token provided" });
    let token = authHeader.split(" ")[1];
    const isGoogleUser = token.slice(0, 6);

    if (isGoogleUser === "google") {
      const googleToken = token.substring(6);

      const client = new OAuth2Client(OAUTH_CLIENT_ID);
      try {
        const ticket = await client.verifyIdToken({
          idToken: googleToken,
          audience: OAUTH_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, name, email } = payload;
        req.user = {
          /* _id: payload["sub"], */
          _id: sub,
          email: name || email || `Guest ${userDecoded.sub}`,
        };
      } catch (error) {
        return res.status(403).send("Invalid credentials");
      }
    } else {
      /* token = req.body.resetToken || req.body.verifyToken || token; */

      try {
        const userDecoded = await jwt.verify(token, JWT_SECRET_CODE);
        req.user = userDecoded.user;

        const userFound = await User.findById(req.user._id);

        if (!userFound) {
          return res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function verifyEmailVerified(req, res, next) {
  const user = await User.findById(req.user._id);
  if (user.emailVerified === true) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function verifyAdmin(req, res, next) {
  const user = await User.findById(req.user._id);
  if (user.role === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

async function verifySuperAdmin(req, res, next) {
  const user = await User.findById(req.user._id);
  if (user.role === "superadmin") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  verifyToken,
  verifyEmailVerified,
  verifyAdmin,
  verifySuperAdmin,
};