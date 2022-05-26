const Cart = require('../models/cart');

const getUserCart = async (req, res, next) => { 
    try {
        const userId = req.userdata.id;
        const cart = await Cart.findOne({owner: userId});
        res.json(cart);

    } catch (error) {
        next(error);
    }
 };

const addToCart = async (req, res, next) => { 
    try {
        const userId = req.userdata.id;
        const productToAdd = req.body.product;
        const cart = await Cart.findOne({owner: userId});

        if (cart) {
            cart.products.push(productToAdd);
            await cart.save();
            res.json('Product added to the cart.');
        } else {
            const newCart = new Cart({products: productToAdd, owner: userId});
            await newCart.save();            
            res.json(newCart);
        }
    } catch (error) {
        next(error);
    }
 };

const removeFromCart = async (req, res, next) => { 
    try {
        const userId = req.userdata.id;
        let removeTarget = req.body.product;
        const cart = await Cart.findOne({owner: userId});

        cart.products = cart.products.filter(e => e.productId !== removeTarget);
        await cart.save();

        res.json('Product deleted from cart.');
    } catch (error) {
        next(error);
    }
 };

const emptyCart = async (req, res, next) => { 
    try {
        const userId = req.userdata.id;
        const cart = await Cart.findOneAndUpdate(
            {owner: userId}, 
            {products: []},
            {new: true}
        );
        res.json(cart);

    } catch (error) {
        next(error);
    }
 };

 const deleteCart = async (req, res, next) => { 
    try {
        const userId = req.userdata.id;
        await Cart.findOneAndDelete({owner: userId});
        res.json('Done.');

    } catch (error) {
        next(error);
    }
 };

 module.exports = {
     getUserCart,
     addToCart,
     removeFromCart,
     emptyCart,
     deleteCart
 };

 //* Comprobar si el usuario existe (?)