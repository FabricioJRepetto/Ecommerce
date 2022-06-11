require('dotenv').config();
const { STRIPE_SKEY } = process.env;
const Order = require('../models/order')
const stripe = require('stripe')(STRIPE_SKEY);//? se puede pasar la key aca?

//! fazt version
const create = async (req, res) => {
    try {
        const { id, amount, description } = req.body;
    
        await stripe.paymentIntents.create({
            amount,
            currency: 'USD',
            description,
            payment_method: id,
            confirm: true
        });

        return res.json('Succefull payment');
    } catch (error) {
        return res.json(error.raw.message);
    }
};

//? Stripe version
// const create = async (req, res) => {
//     //const { id, amount, description } = req.body;
//     // buscar la orden en vez de usar el body?

//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: 2000,
//         currency: "eur",
//         payment_methods_types: ["card"]
//     });

//     res.json({
//     clientSecret: paymentIntent.client_secret,
//   });
// };

module.exports = {
    create
};