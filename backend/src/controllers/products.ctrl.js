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
const { meliItemParser, meliProductParser, meliSearchParser } = require("../utils/meliParser");

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
        const L = 24;
        const meli = `https://api.mercadolibre.com/sites/MLA/search?&official_store=all&limit=${L}&q=${req.query.q}`;

        const { data } = await axios(meli);
        const filters = data.available_filters;

        const resultsMeli = meliSearchParser(data.results);

        const resultsDB = await Product.find({
            name: { '$regex': req.query.q, '$options': "i" },
        });
        console.log(resultsMeli);
        console.log(resultsDB);
        return res.json({ db: resultsDB, meli: resultsMeli, filters });
        // const q = req.query.q;
        // if (!q) return res.status(400).json({ message: "No query to search" });

        // try {
        //     const resultsDB = await Product.find({
        //         name: { $regex: q, $options: "i" },
        //     });
        //     const { data } = await axios.get(
        //         `${MELI_SEARCH_URL}${q}${MELI_SEARCH_URL_ADDONS}`
        //     );
        //     let resultsMeli = [];

        //     for (const product of data.results) {
        //         let newProduct = { name: "" };
        //         newProduct.name = product.title;
        //         newProduct.price = product.price;
        //         if (product.original_price)
        //             //!VOLVER A VER ojo con esto, capaz tira error
        //             newProduct.original_price = product.original_price;
        //         newProduct.free_shipping = product.shipping.free_shipping;
        //         newProduct.images = [];
        //         newProduct.images.push({
        //             imgURL: product.thumbnail,
        //             public_id: product.thumbnail_id,
        //         });
        //         for (const attribute of product.attributes) {
        //             if (attribute.id === "BRAND") {
        //                 newProduct.brand = attribute.value_name;
        //                 break;
        //             }
        //         }
        //         newProduct.catalog_product_id = product.catalog_product_id;

        //         resultsMeli.push(newProduct);
        //     }
        //     let results = [...resultsDB, ...resultsMeli];

        //return res.json(results);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (/^MLA/.test(id)) {
            const meli = `https://api.mercadolibre.com/products/${id}`;
            const { data } = await axios(meli);
            const product = meliProductParser(data);
            return res.json(product);

        } else if (/^IMLA/.test(id)) {
            const meli = `https://api.mercadolibre.com/items/${id.slice(1)}`;
            const { data } = await axios(meli);
            const item = meliItemParser(data);
            return res.json(item);

        } else {
            const product = await Product.findById(id);
            product
                ? res.json(product)
                : res.status(400).json({ code: 400, message: "Wrong product ID" });
        };
        //const idParams = req.params.id;
        //const isMeliProduct = idParams.slice(0, 3);
        // try {
        //     if (isMeliProduct === "MLA") {
        //         const { data: product } = await axios.get(
        //             `${MELI_PRODUCT_ID}${idParams}`
        //         );
        //         if (!product)
        //             return res.status(400).json({ message: "Wrong product ID" });

        //         let newProduct = {};
        //         newProduct.id = product.id;
        //         newProduct.name = product.name;
        //         newProduct.price = product.buy_box_winner.price;
        //         if (product.buy_box_winner.original_price) {
        //             //!VOLVER A VER ojo con esto, capaz tira error
        //             newProduct.original_price = product.buy_box_winner.original_price;
        //         }
        //         newProduct.available_quantity = product.buy_box_winner.available_quantity;
        //         newProduct.free_shipping = product.buy_box_winner.shipping.free_shipping;
        //         newProduct.main_features = [];
        //         for (const feature of product.main_features) {
        //             newProduct.main_features.push(feature.text);
        //         }
        //         newProduct.attributes = [];
        //         for (const attribute of product.attributes) {
        //             if (attribute.id === "BRAND") {
        //                 newProduct.brand = attribute.value_name;
        //                 continue;
        //             }
        //             let newObject = {};
        //             let newAttribute = {};
        //             // newAttribute.id = attribute.id;
        //             newAttribute.name = attribute.name;
        //             newAttribute.value_name = attribute.value_name;
        //             Object.assign(newAttribute, newObject);
        //             newProduct.attributes.push(newAttribute);
        //         }
        //         newProduct.images = [];
        //         for (const image of product.pictures) {
        //             let newImage = {};
        //             newImage.imgURL = image.url;
        //             newImage.public_id = image.id;
        //             newProduct.images.push(newImage);
        //         }
        //         newProduct.description = product.short_description;
        //         return res.json(newProduct);
        //     } else {
        //         const product = await Product.findById(idParams);
        //         product
        //             ? res.json(product)
        //             : res.status(400).json({ code: 400, message: "Wrong product ID" });
        //     }
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

        const newProduct = new Product({
            name,
            price,
            brand,
            main_features,
            attributes,
            description,
            category,
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

        //: como se llama el array de las imagenes a mantener?
        if (imgsToEdit.length > 0) {
            const data = await Product.findById(req.params.id);
            let deleteList = [];
            console.log(data);
            data.images.map(
                (img) =>
                    !imgsToEdit.includes(img.imgURL) && deleteList.push(img.public_id)
            );
            cloudinary.api.delete_resources(deleteList);
        }

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
    let list = req.body;

    try {
        for (const prod of list) {
            let { id, amount } = prod;

            await Product.findOneAndUpdate(
                { _id: id },
                {
                    $inc: {
                        available_quantity: -amount,
                    },
                }
            );
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
