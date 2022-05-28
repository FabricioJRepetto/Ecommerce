require('dotenv').config();
const { CLOUDINARY_CLOUD, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
const Product = require('../models/product');
const cloudinary = require('cloudinary').v2;
const fs = require('fs-extra')

cloudinary.config({ 
  cloud_name: CLOUDINARY_CLOUD, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

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
            : res.status(400).json({code: 400, message: 'Wrong product ID'});
    } catch (error) {
        next(error)
    }
};

const createProduct = async (req, res, next) => {
    try {
        const {name, price, description, attributes, main_features} = JSON.parse(req.body.data);
        const { url: imgURL, public_id } = await cloudinary.uploader.upload(req.file.path); // public_id es la id que le da cloudinary, sirve para eliminarla
        fs.unlink(req.file.path); // elimina el archivo del directorio 'public/uploads'

        const newProduct = new Product({name, price, description, attributes, main_features, imgURL, public_id});
        const productSaved = await newProduct.save();
        res.json(productSaved);
    } catch (error) {
        next(error)
    }
};

const updateProduct = async (req, res, next) => {
    try {
        let newData = JSON.parse(req.body.data);

        if (req.body.new_img) { // Solo si cambia la imagen
            cloudinary.uploader.destroy(newData.public_id);
            const { url: imgURL, public_id } = await cloudinary.uploader.upload(req.file.path);
            fs.unlink(req.file.path);
            newData = {...newData, imgURL, public_id};
        };
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, newData, {new: true});
        res.json(updatedProduct);
    } catch (error) {
        next(error)
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { public_id } = await Product.findById(req.params.id);
        cloudinary.uploader.destroy(public_id);
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json('deleted');
    } catch (error) {
        next(error)
    }
};

const deleteAll = async (req, res, next) => {
    try {
        let idList = await Product.find();
        cloudinary.api.delete_resources(idList.map(e => e.public_id));
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