const Cart = require("../models/cart");
const Product = require("../models/product");

const getUserCart = async (req, res, next) => {
  try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ owner: userId });
        if (!cart) return res.json({message: 'empty cart'});
        return res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productToAdd = req.params.id;
    const cart = await Cart.findOne({ owner: userId });

    const {name, price, description, available_quantity:stock, images} = await Product.findById(productToAdd);

    if (cart) {
        let flag = false; 
        cart.products.forEach(e => {
            e.product_id === productToAdd && (flag = true)
        });

        if (flag) { // si el prod ya existe
            cart.products.map(e => {
                if (e.product_id === productToAdd) {
                    e.quantity ++;
                }
            });
        } else { // si todavia no existe
            cart.products.push({
                product_id: productToAdd,
                product_name: name,
                description,
                img: images[0].imgURL,
                price,
                stock,
                quantity: 1
            });
        };
        await cart.save();
        return res.json({message: "Product added to your cart."});
    } else {
      const newCart = new Cart({
        products: [{
            product_id: productToAdd,
            product_name: name,
            description,
            img: images[0].imgURL,
            price,
            stock,
            quantity: 1
        }],
        owner: userId,
      });
      await newCart.save();
      return res.json(newCart);
    }
  } catch (error) {
        next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
        const userId = req.user._id;
        let target = req.params.id;
        const cart = await Cart.updateOne({ 
            'owner': userId 
        },
        {
            $pull: {
                'products': {'product_id': target}
            }
        }
        );
        return res.json({ message: 'Product removed.'});
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
    return res.json({message: 'Cart emptied succefully'});
  } catch (error) {
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ owner: userId });
    return res.json("Done.");
  } catch (error) {
    next(error);
  }
};

const quantity = async (req, res, next) => {
    try {
        let userId = req.user._id;
        let target = req.query.id;
        let amount = 1;
        req.query.mode === 'add' || (amount = -1);

        const cart = await Cart.findOneAndUpdate({
            'owner': userId,
            'products.product_id': target
        },
        { 
            "$inc": {
                "products.$.quantity": amount
            }
        }, {new: true}
        );
        return res.json(cart.products.map(e => e.quantity))
    } catch (error) {
        next(error);
    }
};

const quantityEx = async (req, res, next) => {
    try {
        let userId = req.user._id;
        let target = req.query.id;
        let amount = req.query.amount;

        await Cart.findOneAndUpdate({
            'owner': userId,
            'products.product_id': target
        },
        { 
            "$set": {
                "products.$.quantity": amount
            }
        });
        return res.json(amount)
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