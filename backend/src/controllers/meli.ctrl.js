const axios = require("axios");
const Product = require('../models/product');
const { meliSearchParser, meliProductParser, meliItemParser } = require("../utils/meliParser");

const getRequest = async (req, res, next) => {
    try {
        const L = 10;
        const meli = `https://api.mercadolibre.com/sites/MLA/search?&official_store=all&limit=${L}&q=${req.params.search}`

        const { data } = await axios(meli);

        const filters = data.available_filters;
        const results = data.results;

        //? imagen: https://http2.mlstatic.com/D_NQ_NP_ thumbnail_id -V.jpg  
        //? .jpg o .webp?
        //: use_thumbnail_id  cuidado???

        let parsedResults = meliSearchParser(results);

        return res.json(parsedResults);
    } catch (error) {
        next(error)
    }
}

const getProduct = async (req, res, next) => {
    try {
        const meli = `https://api.mercadolibre.com/products/${req.params.id}`

        const { data } = await axios(meli);
        const product = meliProductParser(data);

        return res.json(product);
    } catch (error) {
        next(error)
    }
}

const getItem = async (req, res, next) => {
    try {
        const meli = `https://api.mercadolibre.com/items/${req.params.id}`

        const { data } = await axios(meli);
        const product = meliItemParser(data);

        return res.json(product);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getRequest,
    getProduct,
    getItem
};


/* //? FILTROS
    [
        {
            "id": "category",
            "name": "Categorías",
            "values": [
                {
                    "id": "MLA417704",
                    "name": "Smartwatches y Accesorios",
                    "results": 398
                }
            ]
        },
        {
            "id": "official_store",
            "name": "Tiendas oficiales",
            "values": [
                {
                    "id": "1218",
                    "name": "Garmin Argentina",
                    "results": 114
                }
            ]
        },
        {
            "id": "discount",
            "name": "Descuentos",
            "values": [
                {
                    "id": "10-100",
                    "name": "Desde 10% OFF",
                    "results": 26
                },
            ]
        },
        {
            "id": "shipping_cost",
            "name": "Costo de envío",
            "values": [
                {
                    "id": "free",
                    "name": "Gratis",
                    "results": 417
                }
            ]
        },
        {
            "id": "BRAND",
            "name": "Marca",
            "type": "STRING",
            "values": [
                {
                    "id": "9344",
                    "name": "Apple",
                    "results": 88
                },
            ]
        },
    ]
*/