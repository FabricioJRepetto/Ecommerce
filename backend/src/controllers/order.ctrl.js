const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const { rawIdProductGetter } = require('../utils/rawIdProductGetter');
const { SHIP_COST } = require('../../constants');

const getOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;

        if (!userId || !req.params.id) return res.status(400).json({ message: 'User ID or Order ID not given.' });

        let order = await Order.findOne({
            user: userId,
            _id: req.params.id
        });
        if (!order) return res.json({ message: 'No orders.' });
        return res.json(order);
    } catch (error) {
        next(error)
    }
};

const getOrdersUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        let userOrders = await Order.find({ user: userId });
        return res.json(userOrders);
    } catch (error) {
        next(error)
    }
};

const getOrdersAdmin = async (req, res, next) => { //! SOLO ADMIN
    try {
        const allOrders = await Order.find();
        return res.json(allOrders);
    } catch (error) {
        next(error)
    }
};

const createOrder = async (req, res, next) => {
    try {
        //: recibir la id de la address en vez de los datos?
        const {
            state,
            city,
            zip_code,
            street_name,
            street_number
        } = req.body;

        const cart = await Cart.findOne({ owner: req.user._id });
        let products = cart.products;

        const newOrder = new Order({
            products,
            user: req.user._id,
            shipping_address: {
                state,
                city,
                zip_code,
                street_name,
                street_number
            },
            status: 'pending',
            total: cart.total,
            free_shipping: cart.free_ship_cart,
            shipping_cost: cart.shipping_cost,
            order_type: 'cart'
        });
        await newOrder.save();

        return res.json(newOrder._id);
    } catch (error) {
        next(error)
    }
};

const buyNowOrder = async (req, res, next) => {
    try {
        const {
            product_id,
            quantity,
            state,
            city,
            zip_code,
            street_name,
            street_number
        } = req.body;

        const p = await rawIdProductGetter(product_id)
        const total = quantity * (p.on_sale ? p.sale_price : p.price);

        const newOrder = new Order({
            products: {
                product_name: p.name,
                product_id,
                description: p.description,
                img: p.thumbnail,
                price: p.price,
                sale_price: p.sale_price,
                quantity,
                on_sale: p.on_sale,
            },
            user: req.user._id,
            shipping_address: {
                state,
                city,
                zip_code,
                street_name,
                street_number
            },
            status: 'pending',
            total,
            free_shipping: p.free_shipping,
            shipping_cost: p.free_shipping ? 0 : SHIP_COST,
            order_type: 'buynow'
        });
        await newOrder.save();

        return res.json(newOrder._id);
    } catch (error) {
        next(error)
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        await Order.deleteMany({
            user: req.user._id,
            status: 'pending'
        })
        return res.json('ORDER DELETED');
    } catch (error) {
        next(error)
    }
};

const updateOrder = async (req, res, next) => {
    try {
        let p = false;
        let cart = false;

        const {
            product_id,
            quantity,
            state,
            city,
            zip_code,
            street_name,
            street_number
        } = req.body;

        if (product_id) {
            p = await rawIdProductGetter(product_id)
        } else {
            cart = await Cart.findOne({ owner: req.user._id })
        }
        const pro = p ? {
            product_name: p.name,
            product_id: p._id,
            description: p.description,
            img: p.thumbnail,
            price: p.price,
            sale_price: p.sale_price,
            quantity,
            on_sale: p.on_sale,
        } : false
        const total = p ? quantity * (p.on_sale ? p.sale_price : p.price) : 0;

        const order = await Order.findByIdAndUpdate(req.params.id,
            {
                "$set": {
                    'status': req.body.status || 'pending',
                    'shipping_address': {
                        'state': state && state,
                        'city': city && city,
                        'zip_code': zip_code && zip_code,
                        'street_name': street_name && street_name,
                        'street_number': street_number && street_number
                    },
                    'products': p ? [pro] : [...cart.products],
                    'total': p ? total : cart.total,
                    'free_shipping': p ? p.free_shipping : cart.free_ship_cart,
                    'shipping_cost': p ? p.free_shipping ? 0 : SHIP_COST : cart.shipping_cost,
                }
            },
            { new: true });

        return res.json({ message: `Order status: ${order.status}` })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getOrder,
    createOrder,
    buyNowOrder,
    deleteOrder,
    getOrdersUser,
    getOrdersAdmin,
    updateOrder
};