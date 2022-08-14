require("dotenv").config();
const { default: axios } = require("axios");
const order = require("../models/order");
const product = require("../models/product");
const { MP_SKEY } = process.env;

const deliveryDate = (flash) => {
    // horas restantes hasta las 15hrs de mañana (flash_shipping true)
    let now = new Date();

    //: saltear Domingos
    if (flash) {
        now = now.setDate(now.getDate() + 1);
    } else {
        now = now.setDate(now.getDate() + 3);
    }
    now = new Date(now).toISOString();
    //? ISO string
    // return `${now.split('T')[0]}T15:00:00.000-03:00`;
    //? Milliseconds
    return new Date(`${now.split('T')[0]}T15:00:00.000-03:00`).getTime();
};

const stockUpdater = async (products) => {
    let list = products.map(e => ({ id: e.product_id, amount: e.quantity }));

    for (const prod of list) {
        let { id, amount } = prod;

        if (!/MLA/g.test(id)) {
            await product.findOneAndUpdate(
                { _id: id },
                {
                    $inc: {
                        available_quantity: -amount,
                    },
                }
            );
        }
    }
}

const notificationStripe = async (req, res, next) => {
    try {
        const { id, status } = req.body.data.object;

        if (status === 'succeeded') {
            //? cambiar orden a pagada
            //! volver a ver: checkear zona horaria del servidor ( Date.now() )
            const target = await order.findOne({ payment_intent: id });
            const newOrder = await order.findOneAndUpdate(
                { payment_intent: id },
                {
                    '$set': {
                        status: 'approved',
                        delivery_status: 'shipping',
                        payment_date: new Date().getTime(),
                        delivery_date: target.flash_shipping ? deliveryDate(true) : deliveryDate(false),
                    }
                }, { new: true });

            //? restar unidades de cada stock
            stockUpdater(target.products);
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
            let aux = req.url.replace('/mp/?data.id=', '');
            let id = aux.replace('&type=payment', '');

            const { data } = await axios(`https://api.mercadopago.com/v1/payments/${id}`, {
                headers: {
                    Authorization: `Bearer ${MP_SKEY}`
                }
            });

            if (data.status === 'approved') {
                //? cambiar orden a pagada
                //! volver a ver: checkear zona horaria del servidor ( Date.now() )
                const target = await order.findById(data.external_reference);
                const newOrder = await order.findByIdAndUpdate(data.external_reference,
                    {
                        '$set': {
                            status: 'approved',
                            delivery_status: 'shipping',
                            payment_date: new Date().getTime(),
                            delivery_date: target.flash_shipping ? deliveryDate(true) : deliveryDate(false),
                        }
                    }, { new: true });

                //? restar unidades de cada stock
                stockUpdater(target.products);
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