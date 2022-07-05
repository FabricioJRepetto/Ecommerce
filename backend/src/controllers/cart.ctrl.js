const { SHIP_COST } = require("../../constants");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { rawIdProductGetter } = require('../utils/rawIdProductGetter')

const getUserCart = async (req, res, next) => {
    try {
        if (!req.user._id) return res.status(400).json({ message: 'User ID not given.' });

        const cart = await Cart.findOne({ owner: req.user._id });

        if (!cart) {
            const newCart = await Cart.create({
                products: [],
                buyNow: '',
                owner: req.user._id
            })
            return res.json(newCart)
        }
        let promises = [];
        for (const id of cart.products) {
            promises.push(rawIdProductGetter(id.product_id))
        }
        const data = await Promise.allSettled(promises);

        let products = [];
        let id_list = [];
        let total = 0;
        let free_ship_cart = false;
        let shipping_cost = 0;
        let message = false;

        data.forEach(p => {
            if (p.status === 'fulfilled') {
                products.push({ ...p.value._doc, sale_price: p.value.sale_price, stock: p.value.available_quantity, thumbnail: p.value.thumbnail, quantity: cart.products.find(e => e.product_id === p.value.id).quantity });

                id_list.push(p.value.id);

                total += (p.value.on_sale ? p.value.sale_price : p.value.price) * cart.products.find(e => e.product_id).quantity;

                p.value.free_shipping ? (free_ship_cart = true) : shipping_cost += SHIP_COST;
            }
        })

        if (cart.products.length !== id_list.length) {
            cart.products = cart.products.filter(e => id_list.includes(e.product_id));
            await cart.save();
            message = 'Some products are not available and were removed from your cart';
        }

        return res.json({
            message,
            products,
            id_list,
            total,
            free_ship_cart,
            shipping_cost,
        });
    } catch (error) {
        next(error);
    }
};

const setBuyNow = async (req, res, next) => {
    try {
        await Cart.findOneAndUpdate({ owner: req.user._id },
            {
                '$set': {
                    'buyNow': req.body.product_id
                }
            },
            { new: true });
        return res.json({ message: 'Buy Now setted' });

    } catch (error) {
        next(error)
    }
}

const addToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productToAdd = req.params.id;
        const cart = await Cart.findOne({ owner: userId });

        const { name, price, sale_price, on_sale, free_shipping, discount, description, available_quantity, thumbnail } = await rawIdProductGetter(productToAdd);
        if (cart) {
            let flag = false;
            cart.products.forEach(e => {
                e.product_id === productToAdd && (flag = true)
            });

            if (flag) { // si el prod ya existe
                cart.products.map(e => {
                    if (e.product_id === productToAdd) {
                        e.quantity++;
                    }
                });
            } else { // si todavia no existe
                cart.products.push({
                    product_id: productToAdd,
                    product_name: name,
                    description,
                    img: thumbnail,
                    price,
                    sale_price,
                    on_sale,
                    discount,
                    free_shipping,
                    stock: available_quantity,
                    quantity: 1
                });
            };
            await cart.save();
            return res.json({ message: "Product added to your cart." });
        } else {
            const newCart = new Cart({
                products: [{
                    product_id: productToAdd,
                    product_name: name,
                    description,
                    img: thumbnail,
                    price,
                    sale_price,
                    on_sale,
                    discount,
                    free_shipping,
                    stock,
                    quantity: 1
                }],
                buyNow: '',
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
                    'products': { 'product_id': target }
                }
            }
        );
        return res.json({ message: 'Product removed.' });
    } catch (error) {
        next(error);
    }
};

const emptyCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await Cart.findOneAndUpdate(
            { owner: userId },
            { products: [] },
            { new: true }
        );
        return res.json({ message: 'Cart emptied succefully' });
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
            }, { new: true }
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
    setBuyNow,
    removeFromCart,
    emptyCart,
    deleteCart,
    quantity,
    quantityEx
};