const History = require('../models/History');
const Product = require('../models/product');
const axios = require('axios');

const getHistory = async (req, res, next) => {
    try {
        const meli = 'https://api.mercadolibre.com/products/'

        const history = await History.findOne({ user: req.user._id });
        if (!history.products) return res.json({ message: 'No history recorded' });

        let promises = [];
        history.products.map(e => (
            /^MLA/.test(e)
                ? promises.push(axios(meli + e))
                : promises.push(Product.findById(e))
        ));
        const rawProds = await Promise.all(promises);
        let response = rawProds.filter(e => e !== null);

        /*
        : parsear los resultados de la api de meli
            img={e.images[0].imgURL}
            name={e.name}
            price={e.price}
            sale_price={e.sale_price}
            discount={e.discount}
            prodId={e.id}
            free_shipping={e.free_shipping ? true : false}
            on_sale={e.on_sale}
        */
        return res.json({ products: response });
    } catch (error) {
        next(error)
    }
};

const getVisited = async (req, res, next) => {
    try {
        const history = await History.findOne({ user: req.user._id });
        if (!history) return res.json({ message: 'No history recorded' });
        return res.json(history.products[0]);
    } catch (error) {
        next(error)
    }
};

const getLastSearch = async (req, res, next) => {
    try {
        const history = await History.findOne({ user: req.user._id });
        if (!history) return res.json({ message: 'No history recorded' });
        return res.json(history.last_search);
    } catch (error) {
        next(error)
    }
};

const postVisited = async (req, res, next) => {
    try {
        const {
            product_id,
        } = req.body;

        const h = await History.findOne({ 'user': req.user._id });

        if (h) {
            h.products = h.products.filter(e => e.product_id !== req.body.product_id);

            if (h.products.length < 20) {
                h.products.unshift(product_id);
            } else {
                h.products.unshift(product_id);
                h.products.pop();
            }
            await h.save();

            return res.json({ message: 'History updated' });
        } else {
            const h = await History.create({
                products: [product_id],
                last_search: '',
                user: req.user._id
            });
            await h.save();

            return res.json({ message: 'History updated' });
        }
    } catch (error) {
        next(error)
    }
};

const postSearch = async (req, res, next) => {
    try {
        //: req.body.last_search
        History.findOneAndUpdate({
            'user': req.user._id
        },
            {
                '$set': {
                    'last_search': req.body.last_search
                }
            });
        return res.json({ message: 'Last search updated' });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getHistory,
    getVisited,
    getLastSearch,
    postVisited,
    postSearch,
}