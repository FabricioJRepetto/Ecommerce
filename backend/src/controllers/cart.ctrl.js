const { SHIP_COST } = require("../../constants");
const Cart = require("../models/cart");
const { rawIdProductGetter } = require('../utils/rawIdProductGetter')

const getUserCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ owner: req.user._id });

        if (!cart) {
            const newCart = await Cart.create({
                products: [],
                buyLater: [],
                buyNow: '',
                owner: req.user._id
            })
            return res.json({ ...newCart, id_list: [] })
        }
        let promises = [];
        for (const id of cart.products) {
            promises.push(rawIdProductGetter(id.product_id))
        }
        let promisesB = [];
        for (const id of cart.buyLater) {
            promisesB.push(rawIdProductGetter(id.product_id))
        }
        const data = await Promise.allSettled(promises);

        let products = [];
        let buyLater = [];
        let id_list = [];
        let total = 0;
        let free_ship_cart = false;
        let shipping_cost = 0;
        let message = false;

        const quantityGetter = (id, source) => {
            let { quantity } = cart[source].find(e => e.product_id === id)
            return quantity
        }

        data.forEach(p => {
            if (p.status === 'fulfilled') {
                products.push({
                    _id: p.value._id.toString(),
                    name: p.value.name,
                    free_shipping: p.value.free_shipping,
                    discuount: p.value.discuount,
                    brand: p.value.brand,
                    price: p.value.price,
                    sale_price: p.value.sale_price,
                    on_sale: p.on_sale,
                    stock: p.value.available_quantity,
                    thumbnail: p.value.thumbnail,
                    quantity: quantityGetter(p.value._id.toString(), 'products')
                });
                id_list.push(p.value._id.toString());

                total += (p.value.on_sale ? p.value.sale_price : p.value.price) * quantityGetter(p.value._id.toString(), 'products');

                p.value.free_shipping ? (free_ship_cart = true) : shipping_cost += SHIP_COST;
            }
        });

        const dataB = await Promise.allSettled(promisesB);
        dataB.forEach(p => {
            if (p.status === 'fulfilled') {
                buyLater.push({
                    _id: p.value._id.toString(),
                    name: p.value.name,
                    free_shipping: p.value.free_shipping,
                    discuount: p.value.discuount,
                    brand: p.value.brand,
                    price: p.value.price,
                    sale_price: p.value.sale_price,
                    on_sale: p.on_sale,
                    stock: p.value.available_quantity,
                    thumbnail: p.value.thumbnail,
                    quantity: quantityGetter(p.value._id.toString(), 'buyLater')
                });
            }
        });

        if (cart.products.length !== id_list.length) {
            cart.products = cart.products.filter(e => id_list.includes(e.product_id));
            await cart.save();
            message = 'Some products are not available. Cart updated.';
        }

        return res.json({
            message,
            products,
            buyLater,
            buyNow: cart.buyNow,
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

        if (cart) {
            let flag = false;
            cart.products.forEach(e => {
                if (e.product_id === productToAdd) {
                    flag = true
                }
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
                    quantity: 1
                });
            };
            await cart.save();
            return res.json({ message: "Product added to your cart." });
        } else {
            const newCart = new Cart({
                products: [{
                    product_id: productToAdd,
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

const buyLater = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ owner: userId });

        let aux = {};
        let destiny = 'cart';
        cart.products.forEach(e => {
            if (e.product_id === req.params.id) {
                destiny = 'save';
                aux = { ...e }
            }
        });

        if (destiny === 'save') {
            const newCart = await Cart.findOneAndUpdate({ owner: userId },
                {
                    '$push': {
                        'buyLater': aux
                    },
                    '$pull': {
                        'products': { 'product_id': req.params.id }
                    }
                }, { new: true });

            return res.json({ message: 'Product moved to Cart.', cart: newCart });

        } else {
            aux = cart.buyLater.find(e => e.product_id === req.params.id);
            const newCart = await Cart.findOneAndUpdate({ owner: userId },
                {
                    '$push': {
                        'products': aux
                    },
                    '$pull': {
                        'buyLater': { 'product_id': req.params.id }
                    }
                }, { new: true });

            return res.json({ message: 'Product saved for buying later.', cart: newCart })
        }
    } catch (error) {
        next(error)
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const target = req.query.id;
        const source = req.query.source;

        if (source === 'products') {
            const cart = await Cart.updateOne({
                'owner': userId
            },
                {
                    '$pull': {
                        products: { 'product_id': target }
                    }
                }
            );
        } else {
            const cart = await Cart.updateOne({
                'owner': userId
            },
                {
                    '$pull': {
                        buyLater: { 'product_id': target }
                    }
                }
            );
        }

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
    buyLater,
    setBuyNow,
    removeFromCart,
    emptyCart,
    deleteCart,
    quantity,
    quantityEx
};