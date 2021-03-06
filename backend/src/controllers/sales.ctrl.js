const axios = require("axios");
const Product = require('../models/product');
const Sales = require('../models/Sales');
const { salesMaker } = require("../jobs/salesMaker");

const getSales = async (req, res, next) => {
    try {
        const sales = await Sales.findOne();
        if (!sales) {
            //:! generar nuevas sales
            const newSales = await Sales.create({
                products: [],
                last_update: Date.now()
            });
            return res.json(newSales)
        };
        const prods = await Product.find({ _id: { '$in': sales.products } });

        const response = prods.map(e => ({
            _id: e._id,
            name: e.name,
            price: e.price,
            on_sale: e.on_sale,
            sale_price: e.sale_price,
            discount: e.discount,
            free_shipping: e.free_shipping,
            thumbnail: e.thumbnail
        }));

        return res.json(response);
    } catch (error) {
        next(error)
    }
};

const setNewSales = async (req, res, next) => {
    try {
        const response = await salesMaker();
        res.json(response);
    } catch (error) {
        next(error)
    }
};

const resetSales = async (req, res, next) => {
    try {
        await Product.updateMany({}, {
            '$set': {
                'on_sale': false
            }
        })
        return res.json('Sales reset')
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getSales,
    setNewSales,
    resetSales
};

