const History = require('../models/History');
const Product = require('../models/product');
const axios = require('axios');
const { rawIdProductGetter } = require('../utils/rawIdProductGetter');
const { meliSearchParser } = require('../utils/meliParser');

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

const getSuggestion = async (req, res, next) => {
    try {
        const history = await History.findOne({ 'user': req.user._id });
        let response = '';

        //? busco categoria del ultimo visto
        const { category } = await rawIdProductGetter(history.products[0]);
        if (!category) return res.json({ error: 404, message: 'No category found in history' });

        //? busco descuento maximo disponible
        const { data: categoryRes } = await axios(`https://api.mercadolibre.com/sites/MLA/search?&official_store=all&category=${category}`);
        const desc = categoryRes.available_filters.find(e => e.id === 'discount')?.values.pop().id || false;
        //? si no hay desc disponibles, filtramos por envio gratis
        let ship = false
        if (!desc) {
            ship = 'free'
        }

        //? genero busqueda aplicando descuento max
        const { data } = await axios(`https://api.mercadolibre.com/sites/MLA/search?&official_store=all&category=${category}&discount=${desc}&shipping_cost=${ship}`);
        //? formateo resultados
        response = await meliSearchParser(data.results.slice(0, 5));

        //? si no llega a 5 resultados
        if (response.length < 5) {
            //? parseamos todos los resultados de la categoria
            let fillers = await meliSearchParser(categoryRes.results);

            if (desc) {
                //? agregamos resultados con envio gratis
                response = [...response, ...fillers.filter(e =>
                    !e.on_sale && e.free_shipping
                )];
                //? ...agregamos el resto de resultados
                if (response.length < 5) {
                    response = [...response, ...fillers.filter(e =>
                        !e.on_sale && !e.free_shipping
                    )].slice(0, 5);
                }
            } else {
                //? ...agregamos el resto de resultados
                response = [...response, ...fillers.filter(e =>
                    !e.free_shipping
                )].slice(0, 5);
            }
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