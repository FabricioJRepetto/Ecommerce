const Order = require('../models/order');

const getOrder = async (req, res, next) => { 
    try {
        const userId = req.user._id;
        const orderId = req.params.id;
        let order = await Order.findOne({
            user: userId,
            _id: orderId
        });
        order ? res.json(order) : res.status(404).json('Order not found');
    } catch (error) {
        next(error)
    }
 };

const getOrdersUser = async (req, res, next) => { 
    try {
        const userId = req.user._id;
        let userOrders = await Order.find({user: userId});
        res.json(userOrders);
    } catch (error) {
        next(error)
    }
 };

const getOrdersAdmin= async (req, res, next) => { //! SOLO ADMIN
    try {
        const allOrders = await Order.find();
        res.json(allOrders);
    } catch (error) {
        next(error)
    }
 };

const createOrder = async (req, res, next) => { 
    try {
        const userId = req.user._id;
        const { products, status } = req.body;

        const newOrder = new Order({
            user: userId,
            status,
            products
        });
        await newOrder.save();
        res.json(newOrder._id);        
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
     getOrdersUser,
     getOrdersAdmin
 };