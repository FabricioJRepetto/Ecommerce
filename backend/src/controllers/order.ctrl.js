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
        //: recibir la id de la address en vez de los datos?
        const {
            state,
            city,
            zip_code,
            street_name,
            street_number
        } = req.body;
        
        const cart = await Cart.findOne({owner: req.user._id});
        let products = cart.products;

        let free = cart.free_ship_cart;       

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
            free_shipping: free,
            shipping_cost: free ? 0 : 300,
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
        
        return res.json({message: `Order status: ${order.status}`})
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