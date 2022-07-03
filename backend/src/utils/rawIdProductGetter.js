const Product = require("../models/product");
const { meliItemParser, meliProductParser } = require("./meliParser");
const axios = require('axios')

const rawIdProductGetter = async (id) => {
    try {
        if (/^MLA/.test(id)) {
            const meli = `https://api.mercadolibre.com/products/${id}`;
            const { data } = await axios(meli);
            const product = meliProductParser(data);
            return product;

        } else if (/^IMLA/.test(id)) {
            const meli = `https://api.mercadolibre.com/items/${id.slice(1)}`;
            const { data } = await axios(meli);
            const item = meliItemParser(data);
            return item;

        } else {
            const product = await Product.findById(id);
            if (product) {
                return product

            } else {
                console.log('ERROR id getter');
                return { code: 400, message: "Wrong product ID" }
            }
        };

    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    rawIdProductGetter,
};