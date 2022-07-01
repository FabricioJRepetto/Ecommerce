const Whishlist = require('../models/whishlist');
const Product = require('../models/product');

const getUserList = async (req, res, next) => {
    try {
        const meli = 'https://api.mercadolibre.com/products/'

        const whishlist = await Whishlist.findOne({ user: req.user._id });

        if (whishlist === null) {
            const newList = await Whishlist.create({
                products: [],
                user: req.user._id
            })
            return res.json({ message: 'Whishlist created', products: newList.products, id_list: newList.products })
        }

        let promises = [];
        whishlist.products.map(e => (
            /^MLA/.test(e)
                ? promises.push(axios(meli + e))
                : promises.push(Product.findById(e))
        ));
        const rawProds = await Promise.all(promises);
        let response = rawProds.filter(e => e !== null);

        /*
        : parsear los resultados de la api de meli
            
        */

        return res.json({ products: response, id_list: whishlist.products });

    } catch (error) {
        next(error);
    }
};

const addToList = async (req, res, next) => {
    try {
        const list = await Whishlist.findOne({ user: req.user._id });

        if (list) {
            let aux = list.products.includes(req.params.id)
            if (!aux) {
                list.products.push(req.params.id);
                await list.save();
                return res.json({ message: "Product added to the whishlist.", list });
            }
            return res.json({ message: "Product already on whishlist." });
        } else {
            const newList = new Whishlist({
                products: [req.params.id],
                user: req.user._id
            });
            await newList.save();
            return res.json({ message: 'Whishlist created and product added.' });
        }
    } catch (error) {
        next(error);
    }
};

const removeFromList = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const target = req.params.id;
        const list = await Whishlist.findOneAndUpdate({
            'user': userId
        },
            {
                $pull: {
                    'products': target
                }
            },
            { new: true }
        );
        return res.json({ message: 'Product removed from whishlist', list });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserList,
    addToList,
    removeFromList
};