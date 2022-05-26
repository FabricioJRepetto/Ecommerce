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
            let updatedProducts = [...cart.products, productToAdd];
            await cart.update({products: updatedProducts});
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
        const userId = req.body.id; // req.userdata.id
        const productToRemove = req.body.product; //? debería ser string
        const cart = await Cart.findOne({user: userId});

        let updatedProducts = cart.products.filter(e => {
            e.productId !== productToRemove
        });
        await cart.update({products: updatedProducts});
        res.json('Product deleted from cart.')

    } catch (error) {
        next(error);
    }
 };

const emptyCart = async (req, res, next) => { 
    try {
        const userId = req.body.id; // req.userdata.id
        const cart = await Cart.findOne({user: userId});
        await cart.update({products: []});
        res.json('Cart emptied.')

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