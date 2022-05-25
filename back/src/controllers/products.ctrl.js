const Product = require('../models/product')

const getAll = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        next(error)
    }
};

const getById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        product
            ? res.json(product)
            : res.status(400).json({code: 400, message: 'Product ID not found'});
    } catch (error) {
        next(error)
    }
};

const createProduct = async (req, res, next) => {
    try {
        const {name, price, description, attributes, main_features, imgURL} = req.body;
        const newProduct = new Product({name, price, description, attributes, main_features, imgURL});
        const productSaved = await newProduct.save();
        res.json(productSaved);
    } catch (error) {
        next(error)
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(updatedProduct);
    } catch (error) {
        next(error)
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        res.status(204).json(deleted);
    } catch (error) {
        next(error)
    }
};

const deleteAll = async (req, res, next) => {
    try {
        const deleted = await Product.deleteMany();
        res.status(200).json(deleted);
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getAll,
    getById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAll
}