const axios = require("axios");
const Product = require('../models/product');

const getRequest = async (req, res, next) => {
    try {
        const meli = 'https://api.mercadolibre.com/sites/MLA/search?&official_store=all&limit=10'
        const search = '&q=' + req.params.search;

        const { data } = await axios(meli + search);

        const filters = data.available_filters;
        const results = data.results;

        //? imagen: https://http2.mlstatic.com/D_NQ_NP_ thumbnail_id -V.jpg  
        //? .jpg o .webp?
        //: use_thumbnail_id  cuidado???

        const discPrice = (original, price) => {
            let discount = (100 - Math.round((price / original) * 100));
            return Math.round(original * (1 - (discount / 100)))
        }


        let parsedResults = results.map(e => ({
            _id: e.id,
            name: e.title,
            thumbnail: `https://http2.mlstatic.com/D_NQ_NP_${e.thumbnail_id}-V.jpg`,
            price: e.original_price ? e.original_price : e.price,
            on_sale: e.original_price ? true : false,
            discount: e.original_price ? (100 - Math.round((e.price / e.original_price) * 100)) : 0,
            sale_price: e.original_price ? discPrice(e.original_price, e.price) : 0,
            free_shipping: e.shipping.free_shipping,
            brand: e.attributes.find(e => e.id === 'BRAND').value_name
        }))

        //* e.original_price ? original*(0.(100-discount)) : e.price
        // (100 - Math.round((e.price / e.original_price) * 100));

        return res.json(parsedResults);
    } catch (error) {
        next(error)
    }
}

const getProduct = async (req, res, next) => {
    try {
        const meli = 'https://api.mercadolibre.com/products/'
        const id = req.params.id;

        const { data } = await axios()

        return res.json(search);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getRequest,
    getProduct
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