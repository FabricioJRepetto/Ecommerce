const Cart = require("../models/cart");
const Product = require("../models/product");

const getUserCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ owner: userId });
    if (!cart) return res.json('empty cart');
    let userCart = [];
    for (const product of cart.products) {
        const productDetail = await Product.findById(product.productId);
        productDetail && userCart.push({
            details: productDetail, 
            quantity: product.quantity
        });
    }
    res.json(userCart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productToAdd = req.params.id;
    const cart = await Cart.findOne({ owner: userId });

    if (cart) {
        let flag = false; 
        cart.products.forEach(e => {
            e.productId.toString() === productToAdd && (flag = true)
        });

        if (flag) { // si el prod ya existe
            cart.products.map(e => {
                if (e.productId.toString() === productToAdd) {
                    e.quantity ++;
                }
            });
        } else { // si todavia no existe
            cart.products.push({
                productId: productToAdd,
                quantity: 1
            });
        };
        await cart.save();
        res.json("Product added to your cart.");
    } else {
      const newCart = new Cart({
        products: {
          productId: productToAdd,
          quantity: 1
        },
        owner: userId,
      });
      await newCart.save();
      res.json(newCart);
    }
  } catch (error) {
        next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let removeTarget = req.params.id;
    const cart = await Cart.findOne({ owner: userId });

    cart.products = cart.products.filter((e) => e.productId !== removeTarget);
    await cart.save();

    res.json("Product deleted from cart.");
  } catch (error) {
    next(error);
  }
};

const emptyCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOneAndUpdate(
      { owner: userId },
      { products: [] },
      { new: true }
    );
    res.json('Cart emptied succefully');
  } catch (error) {
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ owner: userId });
    res.json("Done.");
  } catch (error) {
    next(error);
  }
};

const quantity = async (req, res, next) => {
    try {
        let userId = req.user._id;
        let target = req.query.id;
        let amount = req.query.amount;

        const cart = await Cart.findOneAndUpdate({
            'owner': userId,
            'products.productId': target
        },
        { 
            "$inc": {
                "products.$.quantity": amount
            }
        }, {new: true}
        );
        res.json(cart.products.map(e => e.quantity))
    } catch (error) {
        next(error);
    }
};

const quantityEx = async (req, res, next) => {
    try {
        let userId = req.user._id;
        let target = req.query.id;
        let amount = req.query.amount;

        const cart = await Cart.findOneAndUpdate({
            'owner': userId,
            'products.productId': target
        },
        { 
            "$set": {
                "products.$.quantity": amount
            }
        });
        res.json(amount)
    } catch (error) {
        next(error);
    }
};

module.exports = {
  getUserCart,
  addToCart,
  removeFromCart,
  emptyCart,
  deleteCart,
  quantity,
  quantityEx
};