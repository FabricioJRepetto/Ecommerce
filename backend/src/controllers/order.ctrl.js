const Order = require('../models/order');
const Cart = require('../models/cart');

const getOrder = async (req, res, next) => { 
    try {
        const userId = req.user._id;
        const orderId = req.params.id;
        let order = await Order.findOne({
            user: userId,
            _id: orderId
        });
        if (order) {
            console.log(order);
            return res.json(order)
        } else {
            return res.status(404).json('Order not found')
        };
    } catch (error) {
        next(error)
    }
 };

const getOrdersUser = async (req, res, next) => { 
    try {
        const userId = req.user._id;
        let userOrders = await Order.find({user: userId});
        return res.json(userOrders);
    } catch (error) {
        next(error)
    }
 };

const getOrdersAdmin= async (req, res, next) => { //! SOLO ADMIN
    try {
        const allOrders = await Order.find();
        return res.json(allOrders);
    } catch (error) {
        next(error)
    }
 };

const createOrder = async (req, res, next) => { 
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({owner: userId});
        let products = cart.products;

        const newOrder = new Order({
            user: userId,
            status: 'Pending',
            products
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
            status: 'Pending'    
        })
        return res.json('ORDER DELETED');
    } catch (error) {
        next(error)
    }
 };

 const updateOrder = async (req, res, next) => { 
     //: añadir mas opciones de status ?
     try {
        const order = await Order.findByIdAndUpdate(req.params.id,
        {
            "$set": {
                status: "Paid"
            }
        });
        
        return res.json(`Order status: ${order.status}`)
     } catch (error) {
         next(error)
     }
  }

 module.exports = {
     getOrder,
     createOrder,
     deleteOrder,
     getOrdersUser,
     getOrdersAdmin,
     updateOrder
 };