const axios = require("axios");
const Product = require('../models/product');

const getRequest = async (req, res, next) => {
    try {
        const meli = 'https://api.mercadolibre.com/sites/MLA/search?&official_store=all&limit=10'
        const search = req.params.search;

        const { data } = await axios()

        return res.json(search);
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

