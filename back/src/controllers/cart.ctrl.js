const Cart = require('../models/cart');

const getUserCart = async (req, res, next) => { 
    try {
        const userId = req.body.id; // req.userdata.id
        const cart = await Cart.findOne({user: userId});
        res.json(cart);

    } catch (error) {
        next(error);
    }
 };

const addToCart = async (req, res, next) => { 
    try {
        const userId = req.body.id; // req.userdata.id
        const productToAdd = req.body.product; //? debería ser string
        const cart = await Cart.findOne({user: userId});

        if (cart) {
            let updateProducts = [...cart.products, productToAdd];
            await cart.update({products: updateProducts});
            res.json(`Product added to the cart.`);

        } else {
            const newCart = new Cart({products: productToAdd, user: userId});
            await newCart.save();            
            res.json(newCart)
        }
    } catch (error) {
        next(error);
    }
 };

const removeFromCart = async (req, res, next) => { 
    try {
        
    } catch (error) {
        next(error);
    }
 };

const emptyCart = async (req, res, next) => { 
    try {
        
    } catch (error) {
        next(error);
    }
 };

 module.exports = {
     getUserCart,
     addToCart,
     removeFromCart,
     emptyCart
 };