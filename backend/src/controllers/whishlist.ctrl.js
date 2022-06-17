const Whishlist = require('../models/whishlist');
const Product = require('../models/product');

const getUserList = async (req, res, next) => {
    try {
        const { products } = await Whishlist.findOne({owner: req.user.id});
        return res.json(products)
    } catch (error) {
        next(error);
    }
};

const addToList = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const product = await Product.findbyId(productId);
        console.log(product);
        if (!product) return res.json({message: 'Product not found.'});

        const list = await Whishlist.findOne({ 
            owner: userId 
        });

        if (list) {
            list.products.push(product);
            await list.save();
            return res.json({message: "Product added to the whishlist."});
        } else {
            const newList = new Whishlist({ 
                products: productToAdd, 
                owner: userId 
            });
            await newList.save();

            return res.json({message: 'Whishlist created and product added.'});
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

        return res.json({message: "Product removed from whishlist."});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserList,
    addToList,
    removeFromList
};