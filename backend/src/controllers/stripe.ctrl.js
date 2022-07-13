require('dotenv').config();
const { STRIPE_SKEY } = process.env;
const Order = require('../models/order')
const stripe = require('stripe')(STRIPE_SKEY);

const YOUR_DOMAIN = 'http://localhost:3000/profile/orders'

const create = async (req, res, next) => {
    try {
        // const orderId = req.params.id;

        // //? order
        // let items = [];
        // const order = await Order.findById(orderId);

        // for (const prod of order.products) {
        //     items.push({
        //         price_data: {
        //             currency: 'ars',
        //             unit_amount: prod.on_sale ? prod.sale_price : prod.price,
        //             product_data: {
        //                 name: prod.product_name,
        //                 images: [prod.img]
        //             },
        //         },
        //         quantity: prod.quantity,
        //     })
        // };

        //: payment_method_types: 'card';
        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: 'ars',
                    unit_amount: 1500000,
                    product_data: {
                        name: 'prod.product_name',
                        images: ['https://res.cloudinary.com/dsyjj0sch/image/upload/v1656904957/beg6e4m7cmjrpdpyyvxh.jpg']
                    },
                },
                quantity: 2,
            }],
            shipping_options: [{
                shipping_rate_data: {
                    display_name: 'TEST SHIPPING COST',
                    type: 'fixed_amount',
                    fixed_amount: {
                        currency: 'ars',
                        amount: 50000
                    }
                }
            }],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });
        return res.json(session)

        //res.redirect(303, session.url);
    } catch (error) {
        //return res.json(error.raw.message);
        next(error)
    }
};

module.exports = {
    create
};