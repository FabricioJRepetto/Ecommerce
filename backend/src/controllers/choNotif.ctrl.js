require("dotenv").config();
const { default: axios } = require("axios");
const order = require("../models/order");
const product = require("../models/product");
const { MP_SKEY } = process.env;

const flash = (flash) => {
    // horas restantes hasta las 15hrs de mañana (flash_shipping true)
    let now = new Date(Date.now() - 10800000);
    let hours = (24 - now.getHours()) + 15;
    if (flash) {
        return Date.now() + (hours * 3600000);
    } else {
        return Date.now() + (hours * 3600000) + 172800000;
    }
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
        console.log(req.body);
        // const { object } = req.body,
        //     paid = object.charges.data[0].paid,
        //     id = object.charges.data[0].payment_intent,
        //     status = object.status;

        // if (paid && status === 'succeeded') {
        //     //? cambiar orden a pagada
        //     //! volver a ver: checkear zona horaria del servidor ( Date.now() )
        //     // await order.findOneAndUpdate(
        //     //     { payment_intent: id },
        //     //     {
        //     //         '$set': {
        //     //             status: 'approved',
        //     //             delivery_status: 'shipping',
        //     //             payment_date: Date.now() - 10800000,
        //     //             delivery_date: flash_shipping ? flash(true) : flash(false),
        //     //         }
        //     //     });
        //     const target = await order.findOne({ payment_intent: id });
        //     target.status = 'approved';
        //     target.delivery_status = 'shipping';
        //     target.payment_date = Date.now() - 10800000;
        //     target.delivery_date = target.flash_shipping ? flash(true) : flash(false);

        //     await target.save();

        //     //? restar unidades de cada stock
        //     stockUpdater(target.products);
        // };

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
                // const newOrder = await order.findByIdAndUpdate(data.external_reference,
                //     {
                //         '$set': {
                //             'status': 'approved'
                //         }
                //     }, { new: true });
                // console.log(newOrder);
                const target = await order.findById(data.external_reference);
                target.status = 'approved';
                target.delivery_status = 'shipping';
                target.payment_date = Date.now() - 10800000;
                target.delivery_date = target.flash_shipping ? flash(true) : flash(false);

                await target.save();

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