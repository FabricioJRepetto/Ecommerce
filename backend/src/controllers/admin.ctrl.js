const mongoose = require("mongoose");
const User = require("../models/user");
const Address = require("../models/Address");
const Order = require("../models/order");
const Wishlist = require("../models/wishlist");
const setUserKey = require("../utils/setUserKey");
const { rawIdProductGetter } = require("../utils/rawIdProductGetter");

const verifyAdminRoute = (req, res, next) => {
  return res.send("ok");
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

const getAllUsers = async (req, res, next) => {
  const allUsersFound = await User.find();

  const usefulData = [
    "_id",
    "email",
    "name",
    "role",
    "emailVerified",
    "avatar",
    "isGoogleUser",
    "googleEmail",
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
      isGoogleUser: null,
      googleEmail: "",
    };
    for (const key in user) {
      if (usefulData.includes(key)) {
        //console.log(key + " " + user[key]);
        newUser[key] = user[key];
      }
    }
    allUsers.push(newUser);
  }
  return res.json(allUsers);
};

const getAddressesAdmin = async (req, res, next) => {
  const { _id, isGoogleUser } = req.body;
  const userKey = setUserKey(isGoogleUser);

  try {
    const addressFound = await Address.findOne({
      [userKey]: _id,
    });

    if (!addressFound) {
      return res.json([]);
    } else {
      return res.json(addressFound.address);
    }
  } catch (error) {
    next(error);
  }
};

const getOrdersAdmin = async (req, res, next) => {
  const { _id, isGoogleUser } = req.body;
  const userKey = setUserKey(isGoogleUser);

  try {
    const ordersFound = await Order.find({
      [userKey]: _id,
    });

    if (!ordersFound) {
      return res.json([]);
    } else {
      return res.json(ordersFound);
    }
  } catch (error) {
    next(error);
  }
};

const getWishlistAdmin = async (req, res, next) => {
  const { _id, isGoogleUser } = req.body;
  const userKey = setUserKey(isGoogleUser);

  try {
    const wishlistFound = await Wishlist.findOne({
      [userKey]: _id,
    });

    if (!wishlistFound) {
      return res.json([]);
    } else {
      let promises = [];
      wishlistFound.products.map((product) =>
        promises.push(rawIdProductGetter(product))
      );
      const rawProds = await Promise.all(promises);
      let products = rawProds.filter((product) => product); //! null undefined

      return res.json(products);
    }
  } catch (error) {
    next(error);
  }
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
  verifyAdminRoute,
  promoteUser,
  getAllUsers,
  getAddressesAdmin,
  getOrdersAdmin,
  getWishlistAdmin,
  deleteUser,
};
