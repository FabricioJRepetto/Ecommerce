const Whishlist = require('../models/whishlist');
const Product = require('../models/product');

const getUserList = async (req, res, next) => {
    try {
        const list = await Whishlist.findOne({user: req.user._id});
        if (!list) {
            const newList = await Whishlist.create({
                products: [],
                user: req.user._id
            })
            return res.json({message: 'Whishlist created', list: newList})
        }
        return res.json(list)
    } catch (error) {
        next(error);
    }
};

const addToList = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const productId = req.params.id;

        const {
            name,
            _id,
            price,
            images
        } = await Product.findById(productId);
        if (!_id) return res.json({message: 'Incorrect ID. Product not found.'});

        const list = await Whishlist.findOne({ 
            user: userId 
        });

        if (list) {
            let aux = list.products.find(e => e.product_id === productId)
            if (!aux) {
                list.products.push({
                    product_name: name,
                    product_id: _id,
                    price,
                    img: images[0].imgURL
                });
                await list.save();
                return res.json({message: "Product added to the whishlist.", list});
            }
            return res.json({message: "Product already on whishlist."});
        } else {
            const newList = new Whishlist({ 
                products: [{
                    product_name: name,
                    product_id: _id,
                    price,
                    img: images[0].imgURL
                }], 
                user: userId 
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
        const userId = req.user._id;
        const target = req.params.id;
        const list = await Whishlist.findOneAndUpdate({ 
            'user': userId 
        },
        {
            $pull: {
                'products': {'product_id': target}
            }
        },
        {new: true}
        );
        console.log(list);
        return res.json({message: 'Product removed', list});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserList,
    addToList,
    removeFromList
};