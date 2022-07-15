const Wishlist = require("../models/wishlist");
const { rawIdProductGetter } = require("../utils/rawIdProductGetter");
const setUserKey = require("../utils/setUserKey");

const getUserList = async (req, res, next) => {
  const { isGoogleUser, _id } = req.user;
  const userKey = setUserKey(isGoogleUser);

  try {
    const wishlist = await Wishlist.findOne({ [userKey]: _id });

    if (wishlist === null) {
      const newList = await Wishlist.create({
        products: [],
        [userKey]: _id,
      });
      return res.json({
        message: "Wishlist created",
        products: newList.products,
        id_list: newList.products,
      });
    }

    let promises = [];
    wishlist.products.map((e) => promises.push(rawIdProductGetter(e)));
    const rawProds = await Promise.all(promises);
    let response = rawProds.filter((e) => e); //! null undefined

    return res.json({ products: response, id_list: wishlist.products });
  } catch (error) {
    next(error);
  }
};

const addToList = async (req, res, next) => {
  const { isGoogleUser } = req.user;
  const userKey = setUserKey(isGoogleUser);

  try {
    if (!req.params.id) {
      throw new Error("no id");
    }
    const list = await Wishlist.findOne({ [userKey]: req.user._id });

    if (list) {
      let aux = list.products.includes(req.params.id);
      if (!aux) {
        list.products.push(req.params.id);
        await list.save();
        return res.json({ message: "Product added to wishlist.", list });
      }
      return res.json({ message: "Product already on wishlist." });
    } else {
      const newList = new Wishlist({
        products: [req.params.id],
        [userKey]: req.user._id,
      });
      await newList.save();
      return res.json({ message: "Wishlist created and product added." });
    }
  } catch (error) {
    next(error);
  }
};

const removeFromList = async (req, res, next) => {
  const { isGoogleUser } = req.user;
  const userKey = setUserKey(isGoogleUser);

  try {
    const target = req.params.id;
    const list = await Wishlist.findOneAndUpdate(
      {
        [userKey]: req.user._id,
      },
      {
        $pull: {
          products: target,
        },
      },
      { new: true }
    );
    return res.json({ message: "Product removed from wishlist", list });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserList,
  addToList,
  removeFromList,
};
