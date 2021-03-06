const Order = require("../models/order");
const Cart = require("../models/cart");
const { rawIdProductGetter } = require("../utils/rawIdProductGetter");
const { SHIP_COST } = require("../../constants");
const { cartFormater } = require("../utils/cartFormater");
const expirationChecker = require("../utils/expirationChecker");

const getOrder = async (req, res, next) => {
    const { _id } = req.user;

    try {
        if (!_id || !req.params.id)
            return res
                .status(400)
                .json({ message: "User ID or Order ID not given." });

        let order = await Order.findOne({
            user: _id,
            _id: req.params.id,
        });

        if (!order) return res.json({ message: "No orders." });

        if (order.status === 'pending' && expirationChecker(order.expiration_date_to)) {
            order = await Order.findByIdAndUpdate(
                req.params.id,
                { status: 'expired' },
                { new: true }
            );
        };

        return res.json(order);
    } catch (error) {
        next(error);
    }
};

const getOrdersUser = async (req, res, next) => {
    const { _id } = req.user;

    try {
        let userOrders = await Order.find({ user: _id });

        for (const order of userOrders) {
            if (order.status === 'pending') {
                if (expirationChecker(order.expiration_date_to)) {
                    order.status = 'expired';
                    await Order.findByIdAndUpdate(
                        order.id,
                        { status: 'expired' }
                    );
                }
            }
        };

        return res.json(userOrders);
    } catch (error) {
        next(error);
    }
};

const createOrder = async (req, res, next) => {
    const { _id } = req.user;

    try {
        const { state, city, zip_code, street_name, street_number } = req.body;

        const cart = await Cart.findOne({ owner: _id });

        const data = await cartFormater(cart);
        const products = data.products.map((e) => ({
            product_name: e.name,
            product_id: e._id,
            description: e.description,
            img: e.thumbnail,
            price: e.price,
            sale_price: e.sale_price,
            quantity: e.quantity,
            on_sale: e.on_sale,
        }));

        const newOrder = new Order({
            products,
            user: _id,
            shipping_address: {
                state,
                city,
                zip_code,
                street_name,
                street_number,
            },
            flash_shipping: cart.flash_shipping,
            status: "pending",
            total: data.total,
            free_shipping: data.free_ship_cart,
            shipping_cost: data.shipping_cost,
            order_type: "cart",
        });
        await newOrder.save();

        return res.json(newOrder._id);
    } catch (error) {
        next(error);
    }
};

const buyNowOrder = async (req, res, next) => {
    const { _id } = req.user;

    try {
        const {
            product_id,
            flash_shipping,
            quantity,
            state,
            city,
            zip_code,
            street_name,
            street_number,
        } = req.body;

        const p = await rawIdProductGetter(product_id);
        const total = quantity * (p.on_sale ? p.sale_price : p.price);

        let shipping_cost = 0;
        if (flash_shipping) {
            if (p.free_shipping) {
                shipping_cost = SHIP_COST / 2;
            } else {
                shipping_cost = SHIP_COST * 1.5;
            }
        } else {
            if (p.free_shipping) {
                shipping_cost = 0;
            } else {
                shipping_cost = SHIP_COST;
            }
        }

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
            user: _id,
            shipping_address: {
                state,
                city,
                zip_code,
                street_name,
                street_number,
            },
            status: "pending",
            total,
            flash_shipping,
            free_shipping: p.free_shipping,
            shipping_cost,
            order_type: "buynow",
        });
        await newOrder.save();

        return res.json(newOrder._id);
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    const { _id } = req.user;

    try {
        await Order.deleteMany({
            user: _id,
            status: "pending",
        });
        return res.json({ message: "Order deleted" });
    } catch (error) {
        next(error);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        let p = false;
        let cart = false;

        const {
            product_id,
            quantity,
            flash_shipping,
            state,
            city,
            zip_code,
            street_name,
            street_number,
        } = req.body;

        if (req.body.status) {
            // cambiar estado a pagado y agregar fecha de pago y de entrega
            if (req.body.status === "approved") {
                const flash = (flash) => {
                    // horas restantes hasta las 15hrs de ma??ana (flash_shipping true)
                    let now = new Date(Date.now() - 10800000);
                    let hours = (24 - now.getHours()) + 15;
                    if (flash) {
                        return Date.now() + (hours * 3600000);
                    } else {
                        return Date.now() + (hours * 3600000) + 172800000;
                    }
                };

                const order = await Order.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: {
                            status: req.body.status,
                            payment_date: Date.now() - 10800000,
                            delivery_date: flash_shipping ? flash(true) : flash(false),
                            delivery_status: 'shipping'
                        },
                    },
                    { new: true }
                );
                return res.json({ message: `Order status: ${order.status}` });
            } else {

                const order = await Order.findById(req.params.id);

                if (order.status !== 'approved') {
                    // await Order.findByIdAndUpdate(
                    //     req.params.id,
                    //     {
                    //         $set: {
                    //             status: req.body.status,
                    //         },
                    //     },
                    //     { new: true }
                    // );
                    order.status = req.body.status;
                    await order.save()
                    return res.json({ message: `Order status: ${order.status}` });
                }
                return res.json({ message: `Order status: approved` });
            }
        }

        if (product_id) {
            p = await rawIdProductGetter(product_id);
        } else {
            const data = await Cart.findOne({ owner: req.user._id });
            cart = await cartFormater(data);
            cart.products = cart.products.map((e) => ({
                product_name: e.name,
                product_id: e._id,
                description: e.description,
                img: e.thumbnail,
                price: e.price,
                sale_price: e.sale_price,
                quantity: e.quantity,
                on_sale: e.on_sale,
            }));
        }
        const pro = p
            ? {
                product_name: p.name,
                product_id: p._id,
                description: p.description,
                img: p.thumbnail,
                price: p.price,
                sale_price: p.sale_price,
                quantity,
                on_sale: p.on_sale,
            }
            : false;
        const total = p ? quantity * (p.on_sale ? p.sale_price : p.price) : 0;

        await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: "pending",
                    shipping_address: {
                        state: state && state,
                        city: city && city,
                        zip_code: zip_code && zip_code,
                        street_name: street_name && street_name,
                        street_number: street_number && street_number,
                    },
                    flash_shipping: flash_shipping || false,
                    products: p ? [pro] : [...cart.products],
                    total: p ? total : cart.total,
                    flashflash_shipping: cart.flash_shipping,
                    free_shipping: p ? p.free_shipping : cart.free_ship_cart,
                    shipping_cost: p
                        ? p.free_shipping
                            ? 0
                            : SHIP_COST
                        : cart.shipping_cost,
                },
            },
            { new: true }
        );

        return res.json({ message: `Order updated.` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOrder,
    createOrder,
    buyNowOrder,
    deleteOrder,
    getOrdersUser,
    updateOrder,
};
