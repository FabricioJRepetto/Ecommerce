const History = require('../models/History');
const Product = require('../models/product');
const axios = require('axios');
const { rawIdProductGetter } = require('../utils/rawIdProductGetter');

const getHistory = async (req, res, next) => {
    try {
        const history = await History.findOne({ user: req.user._id });

        if (history === null) {
            await History.create({
                products: [],
                last_search: '',
                user: req.user._id
            })
            return res.json({ message: 'History created' })
        }

        let promises = [];
        history.products.map(e => (
            promises.push(rawIdProductGetter(e))
        ));
        const rawProds = await Promise.all(promises);
        let response = rawProds.filter(e => e !== null);

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
            h.products = h.products.filter(e => e !== product_id);

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
    console.log(req.params.search);
    try {
        const h = await History.findOne({
            'user': req.user._id
        });

        if (!h) {
            const nh = await History.create({
                products: [],
                last_search: req.params.search,
                user: req.user._id
            });
            await nh.save();
            return res.json({ message: 'Last search updated' });
        }
        h.last_search = req.params.search;
        await h.save()
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