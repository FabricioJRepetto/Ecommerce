require("dotenv").config();
const { default: axios } = require("axios");
const order = require("../models/order");
const { MP_SKEY } = process.env;

const notificationStripe = async (req, res, next) => {
    try {
        const { object } = req.body,
            paid = object.charges.data[0].paid,
            id = object.charges.data[0].payment_intent,
            status = object.status;

        if (paid && status === 'succeeded') {
            await order.findOneAndUpdate(
                { payment_intent: id },
                {
                    '$set': {
                        'status': 'approved'
                    }
                })
        };

        return res.status(200).send('hola buen dia');
    } catch (error) {
        next(error)
    }
};

const notificationMercadopago = async (req, res, next) => {
    try {
        console.log(req.url);
        const { type } = req.query;

        if (type === 'payment') {
            let aux = req.url.replace('/?data.id=', '');
            let id = aux.replace('&type=payment', '');

            const { data } = await axios(`https://api.mercadopago.com/v1/payments/${id}`, {
                headers: {
                    Authorization: `Bearer ${MP_SKEY}`
                }
            });

            if (data.status === 'approved') {
                const newOrder = await order.findByIdAndUpdate(data.external_reference,
                    {
                        '$set': {
                            'status': 'approved'
                        }
                    }, { new: true })
                console.log(newOrder);
            }
        }

        return res.status(200).send('')
    } catch (error) {
        next(error)
    }
};

module.exports = {
    notificationStripe,
    notificationMercadopago
};