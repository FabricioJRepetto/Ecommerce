require('dotenv').config();
const { STRIPE_SKEY } = process.env;
const Order = require('../models/order')
const stripe = require('stripe')(STRIPE_SKEY);//? se puede pasar la key aca?

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

module.exports = {
    create
};