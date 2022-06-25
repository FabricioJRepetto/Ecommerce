const Order = require('../models/order');
const Cart = require('../models/cart');

const getOrder = async (req, res, next) => { 
    try {
        const userId = req.user._id;

        if (!userId || !req.params.id) return res.status(400).json({message: 'User ID or Order ID not given.'});

        let order = await Order.findOne({
            user: userId,
            _id: req.params.id
        });
        if (!order) return res.json({message: 'No orders.'});
        return res.json(order);
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
        const {
            state,
            city,
            zip_code,
            street_name,
            street_number
        } = req.body;
        
        const cart = await Cart.findOne({owner: userId});
        let products = cart.products;

        const newOrder = new Order({
            user: userId,
            status: 'pending',
            products,
            shipping_address: {
                state,
                city,
                zip_code,
                street_name,
                street_number
            }
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
     //: añadir mas opciones de status ?
     console.log(req.headers);
     try {
        const order = await Order.findByIdAndUpdate(req.params.id,
        {
            "$set": {
                status: req.body.status
            }
        },
        {new: true});
        
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