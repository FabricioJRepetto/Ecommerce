require('dotenv').config();
const { MP_SKEY } = process.env;
const Order = require('../models/order');
const mercadopago = require("mercadopago");

const BACK_URL = 'http://localhost:4000';

const mpCho = async (req, res, next) => {
    const id = req.params.id;

    // SDK de Mercado Pago
    // Agrega credenciales
    mercadopago.configure({
        access_token: MP_SKEY,
    });

    // Crea un objeto de preferencia
    //? order
    let items = [];
    const order = await Order.findById(id);
    console.log(order.id);

    for (const prod of order.products) {
        items.push({
            id: prod.product_id,
            title: prod.product_name,
            description: prod.description,
            picture_url: prod.img[0],
            unit_price: prod.price,
            quantity: prod.quantity,
        })
    };
    
    let preference = {
        items,
        external_reference: id,
        //notification_url: `${BACK_URL}/mercadopago/ipn`
        //! esto no hacefalta cuando tenga el endpoint & deploy
        back_urls: {
            success: `http://localhost:3000/orders/post-sale/${id}`,
            failure: `http://localhost:3000/orders/post-sale/${id}`,
            pending: `http://localhost:3000/orders/post-sale/${id}`
        },
    };

    try {
        const {response} = await mercadopago.preferences.create(preference);
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