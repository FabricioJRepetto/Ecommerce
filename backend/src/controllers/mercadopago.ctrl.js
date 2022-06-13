require('dotenv').config();
const { PROD_ACCESS_TOKEN } = process.env;
const mercadopago = require("mercadopago");

const mpCho = async (req, res, next) => {

    // SDK de Mercado Pago
    // Agrega credenciales
    mercadopago.configure({
        //: back urls
        access_token: PROD_ACCESS_TOKEN,
    });


    // Crea un objeto de preferencia
    //: order
    let preference = {
        items: [
            {
            title: "Mi producto",
            unit_price: 100,
            quantity: 1,
            },
        ],
    };

    try {
        const {response} = await mercadopago.preferences.create(preference);
        res.json(response);
    } catch (error) {
        console.log(error);
    };
};

module.exports = {
    mpCho
};