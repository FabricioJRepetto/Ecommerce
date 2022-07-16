require("dotenv").config();
const {
    CLOUDINARY_CLOUD,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    MELI_SEARCH_URL,
    MELI_SEARCH_URL_ADDONS,
    MELI_PRODUCT_ID,
} = process.env;
const Product = require("../models/product");
const cloudinary = require("cloudinary").v2;
const fs = require("fs-extra");
const axios = require("axios");
const { meliSearchParser } = require("../utils/meliParser");
const { rawIdProductGetter } = require("../utils/rawIdProductGetter");

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
});

const getAll = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const getByQuery = async (req, res, next) => {
    try {
        let searchQuery = '';
        Object.entries(req.query).forEach(([key, value]) => {
            searchQuery += '&' + key + '=' + value
        })
        console.log(req.query);

        const L = "50";
        const meli = `https://api.mercadolibre.com/sites/MLA/search?&official_store=all&limit=${L}${searchQuery}`;

        const { data } = await axios(meli);

        const allowedFilters = [
            'BRAND',
            'discount',
            'shipping_cost',
            'price',
            'category',
        ];
        const filters = data.available_filters.filter(e => allowedFilters.includes(e.id));

        const applied = data.filters.filter(e => e.id !== 'official_store' && e.id !== 'category');

        const breadCrumbs = data.filters.find(e => e.id === 'category')?.values[0].path_from_root;

        const resultsMeli = meliSearchParser(data.results);

        let aux = new RegExp(req.query.q.replace(' ', '|'), 'gi');
        let resultsDB = await Product.find({
            $or: [
                { name: { $in: [aux] } },
                { brand: { $in: [aux] } }
            ]
        });

        const filterDBResults = async (filters, products) => {
            let response = [...products];
            if (filters.BRAND) {
                response = response.filter(e => e.brand.toLowerCase() === filters.BRAND.toLowerCase());
            }
            if (filters.price) {
                let [min, max] = filters.price.split('-');
                min === '*' ? (min === 0) : (min = parseInt(min));
                max = parseInt(max);

                response = response.filter(e => (e.price >= min && e.price <= max));
            }
            if (filters.category) {
                response = response.filter(e => e?.path_from_root.includes(filters.category));
            }
            if (filters.free_shipping) {
                response = response.filter(e => e.free_shipping);
            }
            if (filters.discount) {
                let [filterDisc] = filters.discount.split('-')
                response = response.filter(e => e.discount >= parseInt(filterDisc))
            }
            return response;
        };
        let auxFilters = applied.brand ? { ...req.query, BRAND: applied.brand.values[0].name } : req.query;
        resultsDB = await filterDBResults(auxFilters, resultsDB);

        return res.json({ db: resultsDB, meli: resultsMeli, filters, applied, breadCrumbs });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await rawIdProductGetter(id);
        return res.json(product);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            price,
            brand,
            category,
            description,
            attributes,
            main_features,
            available_quantity,
            free_shipping,
        } = JSON.parse(req.body.data);
        let images = [];

        let aux = [];
        // creamos una promise por cada archivo.
        req.files.forEach((img) => {
            aux.push(cloudinary.uploader.upload(img.path));
        });
        // esperamos que se suban.
        const promiseAll = await Promise.all(aux);
        // guardamos los datos de cada imagen.
        promiseAll.forEach((e) => {
            images.push({
                imgURL: e.url,
                public_id: e.public_id,
            });
        });
        // borramos los archivos de este directorio.
        req.files.forEach((img) => {
            fs.unlink(img.path);
        });

        //? path_from_root
        const { data } = await axios(`https://api.mercadolibre.com/categories/${category}`);
        const path_from_root = data.path_from_root.map(e => e.id);
        console.log(path_from_root);

        const newProduct = new Product({
            name,
            price,
            brand,
            main_features,
            attributes,
            description,
            category,
            path_from_root,
            available_quantity,
            free_shipping,
            images,
        });
        const productSaved = await newProduct.save();

        res.json(productSaved);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        let {
            name,
            price,
            brand,
            main_features,
            attributes,
            description,
            category,
            available_quantity,
            free_shipping,
            imgsToEdit,
        } = JSON.parse(req.body.data);
        let images = [...imgsToEdit];

        //: validar data antes de subir imagenes
        if (req.files) {
            let aux = [];
            // creamos una promise por cada archivo.
            req.files.forEach((img) => {
                aux.push(cloudinary.uploader.upload(img.path));
            });
            // esperamos que se suban.
            const promiseAll = await Promise.all(aux);
            // guardamos los datos de cada imagen.
            promiseAll.forEach((img) => {
                images.push({
                    imgURL: img.url,
                    public_id: img.public_id,
                });
            });
            // borramos los archivos de este directorio.
            req.files.forEach((img) => {
                fs.unlink(img.path);
            });
        }

        //? actualizar lista de imagenes
        const productFound = await Product.findById(req.params.id);
        if (imgsToEdit.length === 0) {
            let deleteList = [];
            for (const img of productFound.images) {
                deleteList.push(img.public_id);
            }
            cloudinary.api.delete_resources(deleteList);
        } else if (imgsToEdit.length > 0) {
            let deleteList = [];
            let imgToKeepId = [];
            for (const img of imgsToEdit) {
                imgToKeepId.push(img.public_id);
            }
            for (const img of productFound.images) {
                if (!imgToKeepId.includes(img.public_id)) {
                    deleteList.push(img.public_id);
                }
            }
            cloudinary.api.delete_resources(deleteList);
        }

        //? path_from_root
        const path_from_root = await axios(`https://api.mercadolibre.com/categories/${category}`).data.path_from_root.map(e => e.id);

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name,
                    price,
                    brand,
                    main_features,
                    attributes,
                    description,
                    category,
                    path_from_root,
                    available_quantity,
                    free_shipping,
                    images,
                },
            },
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const prod = await Product.findById(req.params.id);
        let deleteList = [];
        prod.images.forEach((img) => deleteList.push(img.public_id));
        cloudinary.api.delete_resources(deleteList);

        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json("deleted");
    } catch (error) {
        next(error);
    }
};

const deleteAll = async (req, res, next) => {
    try {
        //? no borra nada
        cloudinary.api.delete_resources(true);
        //cloudinary.api.delete_folder("products", (error, result) => { console.log(result); });
        const deleted = await Product.deleteMany();
        res.status(200).json(deleted);
    } catch (error) {
        next(error);
    }
};

const stock = async (req, res, next) => {
    try {
        let list = req.body;

        for (const prod of list) {
            let { id, amount } = prod;

            if (!/MLA/g.test(id)) {
                await Product.findOneAndUpdate(
                    { _id: id },
                    {
                        '$inc': {
                            'available_quantity': -amount,
                        },
                    }
                );
            }
        }
        return res.json("stock updated");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getByQuery,
    getById,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAll,
    stock,
};
