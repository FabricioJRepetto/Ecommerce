require('dotenv').config();
const { STRIPE_SKEY } = process.env;
const Stripe = require('stripe');


const stripe = new Stripe(STRIPE_SKEY)

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