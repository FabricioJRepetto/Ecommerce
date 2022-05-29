const Order = require('../models/order');

const getOrder = async (req, res, next) => { 
    try {
        const userId = req.user.id;
        let userOrders = await Order.find({user: userId});
        // let response = userOrders.map(e => {...e, total: e.total });
        res.json(userOrders);
    } catch (error) {
        next(error)
    }
 };

const getOrdersAdminMode = async (req, res, next) => { //! SOLO ADMIN
    try {
        const allOrders = await Order.find();
        res.json(allOrders);
    } catch (error) {
        next(error)
    }
 };

const createOrder = async (req, res, next) => { 
    try {
        const userId = req.user.id;
        const products = req.body.products;
        const status = req.body.status;

        const newOrder = new Order({
            user: userId,
            status,
            products
        });
        await newOrder.save();
        res.json(newOrder);        
    } catch (error) {
        next(error)
    }
 };

const deleteOrder = async (req, res, next) => { //! SOLO ADMIN
    try {
        req.params.id
        ? await Order.deleteMany({user: req.params.id})
        : await Order.deleteMany({});
        res.json('Done.');
    } catch (error) {
        next(error)
    }
 };

 module.exports = {
     getOrder,
     createOrder,
     deleteOrder,
     getOrdersAdminMode
 };