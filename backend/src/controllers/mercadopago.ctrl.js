require('dotenv').config();
const { MP_SKEY } = process.env;
const Order = require('../models/order');
const mercadopago = require("mercadopago");

const BACK_URL = 'http://localhost:4000';

const mpCho = async (req, res, next) => {
    try {
        const id = req.params.id;

        // SDK de Mercado Pago
        // Agrega credenciales
        mercadopago.configure({
            access_token: MP_SKEY,
        });
        /* 
        : por si no sirven las notificaciones de meli usar esto ?
        tracks:     Array
        Localización: Body
        Tracks que se ejecutarán durante la interacción de los usuarios en el flujo de Pago. El usuario puede configurar sus propios tracks. Actualmente soportamos Google y Facebook. El collector debe enviar el pixel ID (de google o facebook), y cuando finalice el flujo de la transacción, el vendedor será notificado de la venta.
        */

        // Crea un objeto de preferencia
        //? order
        let items = [];
        const order = await Order.findById(id);

        for (const prod of order.products) {
            items.push({
                id: prod.product_id,
                title: prod.product_name,
                picture_url: prod.img,
                unit_price: prod.on_sale ? prod.sale_price : prod.price,
                quantity: prod.quantity,
            })
        };

        let preference = {
            items,
            external_reference: id,
            payment_methods: {
                installments: 1,
            },
            shipments: {
                mode: 'not_specified',
                cost: order.shipping_cost,
                receiver_address: {
                    zip_code: order.shipping_address.zip_code,
                    street_name: order.shipping_address.street_name,
                    city_name: order.shipping_address.city,
                    state_name: order.shipping_address.state,
                    street_number: order.shipping_address.street_number,
                    floor: '1',
                    apartment: '4B',
                },
            },
            //notification_url: `${BACK_URL}/mercadopago/ipn`
            // //! esto no hacefalta cuando tenga el endpoint & deploy
            back_urls: {
                success: `http://localhost:3000/orders/post-sale/`,
                failure: `http://localhost:3000/orders/post-sale/`,
                pending: `http://localhost:3000/orders/post-sale/`
            },
        };

        const { response } = await mercadopago.preferences.create(preference);
        res.json(response);
    } catch (error) {
        console.log(error);
    };
};

const notifications = async (req, res, next) => {
    try {
        //! checkear estos params
        const id = req.params.external_reference;

        // con la id, pregunto a mp el estado del pago
        const { data } = await axios.get(`https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=${id}`, {
            headers: {
                Authorization: `Bearer ${MP_SKEY}`,
            }
        });

        const status = data.results[0].status;

        if (status) {
            // cambio el estado de la order
            await Order.findByIdAndUpdate(id,
                {
                    "$set": {
                        status: status
                    }
                });

            if (status === 'approved') {
                // si está todo OK
                //: vaciar carrito
                //: restar unidades de cada stock
            }

            return res.status(200);
        };

    } catch (error) {
        next(error);
    }
};

module.exports = {
    mpCho,
    notifications
};