const History = require('../models/History');
const Product = require('../models/product');
const axios = require('axios');
const { rawIdProductGetter } = require('../utils/rawIdProductGetter');
const { meliSearchParser } = require('../utils/meliParser');

const getHistory = async (req, res, next) => {
    try {
        let message = false;
        const history = await History.findOne({ user: req.user._id });

        if (!history) {
            await History.create({
                products: [],
                last_category: '',
                last_search: '',
                user: req.user._id
            })
            return res.json({ message: 'History created', products: [] })
        }

        let promises = [];
        history.products.map(e => (
            promises.push(rawIdProductGetter(e))
        ));
        const rawProds = await Promise.allSettled(promises);

        let response = [];
        let new_id_list = [];
        rawProds.forEach((e) => {
            if (e.value) {
                response.push(e.value)
                new_id_list.push(e.value._id)
            }
        });

        if (history.products.length !== new_id_list.length) {
            history.products = new_id_list;
            await history.save();
            message = 'Some products are not available. History updated.';
        };

        return res.json({ products: response, message });
    } catch (error) {
        next(error)
    }
};

const getSuggestion = async (req, res, next) => {
    try {
        const history = await History.findOne({ 'user': req.user._id });

        if (!history) {
            await History.create({
                products: [],
                last_search: '',
                user: req.user._id
            })
            return res.json({ message: 'History created', products: [] })
        }

        if (!history.last_category) return res.json({ error: 404, message: 'No category found in history' });

        //? genero busqueda aplicando descuento
        const { data } = await axios(`https://api.mercadolibre.com/sites/MLA/search?official_store=all&category=${history.last_category}&discount=5-100`);
        //? formateo resultados
        let parsed = await meliSearchParser(data.results);

        let response = [];
        let idList = [];
        if (parsed.length > 0) {
            for (let i = 0; response.length < 5; i++) {
                // todas ofertas tarda mucho :( data.discount > 0 &&
                if (parsed[i]) {
                    const product = await rawIdProductGetter(parsed[i]._id);
                    if (product._id) {
                        response.push(product)
                        idList.push(product._id)
                    }
                } else {
                    break
                }
            }
        }

        //? si no llega a 5 resultados
        if (response.length < 5) {
            const { data } = await axios(`https://api.mercadolibre.com/sites/MLA/search?category=${history.last_category}&shipping=free`);
            let parsed = await meliSearchParser(data.results);

            for (let i = 0; response.length < 5; i++) {
                if (parsed[i]) {
                    const product = await rawIdProductGetter(parsed[i]._id);
                    if (product._id) {
                        !product.message && !idList.includes(product._id) && response.push(product)
                    }
                } else {
                    break
                }
            };
        };

        return res.json(response)
    } catch (error) {
        next(error)
    }
};

const postVisited = async (req, res, next) => {
    try {
        const {
            product_id,
            category
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
            h.last_category = category;
            await h.save();

            return res.json({ message: 'History updated' });
        } else {
            const h = await History.create({
                products: [product_id],
                last_category: category,
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
    getSuggestion,
    postVisited,
    postSearch,
}