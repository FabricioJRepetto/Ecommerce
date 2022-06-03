const Whishlist = require('../models/whishlist');

const getUserList = async (req, res, next) => {
    try {
        const {products} = await Whishlist.findOne({owner: req.user.id});
        res.json(products)
    } catch (error) {
        next(error);
    }
};

const addToList = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productToAdd = req.params.id;        
        const list = await Whishlist.findOne({ 
            owner: userId 
        });

        if (list) {
            list.products.push(productToAdd);
            await list.save();
            res.json("Product added to the whishlist.");
        } else {
            const newList = new Whishlist({ 
                products: productToAdd, 
                owner: userId 
            });
            await newList.save();

            res.json('Whishlist created and product added.');
        }
    } catch (error) {
        next(error);
    }
};

const removeFromList = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const target = req.params.id;
        const list = await Whishlist.findOne({ 
            owner: userId 
        });

        list.products = list.products.filter(e => 
            e !== target
        );
        await list.save();

        res.json("Product removed from whishlist.");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserList,
    addToList,
    removeFromList
};