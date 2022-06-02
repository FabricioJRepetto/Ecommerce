require('dotenv').config();
const { STRIPE_SKEY } = process.env;
const Stripe = require('stripe');

const stripe = new Stripe(STRIPE_SKEY)

const create = async (req, res, next) => {
    const { id, amount } = req.body;

    const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'USD',
        description: 'test',
        payment_method: id,
        confirm: true
    });
    console.log(payment);
    res.json('recibido')
};

module.exports = {
    create
};