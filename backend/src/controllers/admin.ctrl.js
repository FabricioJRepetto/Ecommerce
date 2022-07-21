require("dotenv").config();
const {
    CLOUDINARY_CLOUD,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs-extra");
const User = require("../models/user");
const Product = require("../models/product");
const Address = require("../models/Address");
const Order = require("../models/order");
const Wishlist = require("../models/wishlist");
const Sale = require("../models/Sales");
//const setUserKey = require("../utils/setUserKey");
const { rawIdProductGetter } = require("../utils/rawIdProductGetter");

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
});

const verifyAdminRoute = (req, res, next) => {
    return res.send("ok");
};

const promoteUser = async (req, res, next) => {
    const { id } = req.params;
    if (!id) return res.status(403).json({ message: "No id provided" });
    try {
        const userFound = await User.findById(id);
        if (!userFound) return res.status(404).json({ message: "User not found" });
        if (userFound.isGoogleUser)
            return res.status(401).json({ message: "A google User can't be admin" });
        userFound.role === "client" && (userFound.role = "admin");
        await userFound.save();
        return res.json({ message: "User promoted successfully" });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    const allUsersFound = await User.find();

    const usefulData = [
        "_id",
        "email",
        "name",
        "role",
        "emailVerified",
        "avatar",
        "isGoogleUser",
        "googleEmail",
    ];
    let allUsers = [];
    for (const user of allUsersFound) {
        let newUser = {
            _id: "",
            email: "",
            name: "",
            role: "",
            emailVerified: "",
            avatar: "",
            isGoogleUser: null,
            googleEmail: "",
        };
        for (const key in user) {
            if (usefulData.includes(key)) {
                //console.log(key + " " + user[key]);
                newUser[key] = user[key];
            }
        }
        allUsers.push(newUser);
    }
    return res.json(allUsers);
};

const getUser = async (req, res, next) => {
    try {
        const userFound = await User.findById(req.params.id);
        if (!userFound) {
            return res.status(404).json({ message: "User not Found" });
        }
        const {
            name,
            email,
            role,
            emailVerified,
            _id,
            isGoogleUser,
            googleEmail,
            avatar,
        } = userFound;
        return res.json([
            {
                name,
                email,
                role,
                emailVerified,
                _id,
                isGoogleUser,
                googleEmail,
                avatar: avatar || null,
            },
        ]);
    } catch (error) {
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const allOrdersFound = await Order.find();
        return res.json(allOrdersFound);
    } catch (error) {
        next(error);
    }
};

const getUserAddresses = async (req, res, next) => {
    const { _id /* isGoogleUser */ } = req.body;
    //const userKey = setUserKey(isGoogleUser);

    try {
        const addressFound = await Address.findOne({
            user: _id,
        });

        if (!addressFound) {
            return res.json([]);
        } else {
            return res.json(addressFound.address);
        }
    } catch (error) {
        next(error);
    }
};

const getUserOrders = async (req, res, next) => {
    const { _id /* , isGoogleUser */ } = req.body;
    //const userKey = setUserKey(isGoogleUser);

    try {
        const ordersFound = await Order.find({
            user: _id,
        });

        if (!ordersFound) {
            return res.json([]);
        } else {
            return res.json(ordersFound);
        }
    } catch (error) {
        next(error);
    }
};

const getUserWishlist = async (req, res, next) => {
    const { _id /* , isGoogleUser */ } = req.body;
    //const userKey = setUserKey(isGoogleUser);

    try {
        const wishlistFound = await Wishlist.findOne({
            user: _id,
        });

        if (!wishlistFound) {
            return res.json([]);
        } else {
            let promises = [];
            wishlistFound.products.map((product) =>
                promises.push(rawIdProductGetter(product))
            );
            const rawProds = await Promise.all(promises);
            let products = rawProds.filter((product) => product); //! null undefined

            return res.json(products);
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    console.log("-----------llega");
    const { id } = req.params;

    try {
        const userFound = await User.findById(id);
        if (userFound.role === "admin")
            return res.status(401).json({ message: "Unauthorized" });
        //const { avatar: imgToDelete } = await User.findById(id);
        //! VOLVER A VER agregar estraegia para eliminar avatar de cloudinary
        await User.findByIdAndUpdate(id, { role: "deleted" });
        return res.status(204).json({ message: "Deleted successfully" });
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
        const { data } = await axios(
            `https://api.mercadolibre.com/categories/${category}`
        );
        const path_from_root = data.path_from_root.map((e) => e.id);

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
        const { data } = await axios(
            `https://api.mercadolibre.com/categories/${category}`
        );
        const path_from_root = data.path_from_root.map((e) => e.id);

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

const deleteAllProducts = async (req, res, next) => {
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

const getMetrics = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({});
        const googleUsers = await User.countDocuments({ isGoogleUser: true });

        const publishedProducts = await Product.countDocuments({});
        const productsOnSale = await Product.countDocuments({ on_sale: true });

        //! PRODUCTOS POR CATEGORIA

        const sales = await Sale.find();
        //! VOLVER A VER modelo sales que indica?
        let activeSales = 0;
        sales.forEach((sale) => {
            activeSales += sale.products.length;
        });

        const orders = await Order.find();
        let productsSold = 0;
        let totalProfits = 0;
        orders.forEach((order) => {
            productsSold += order.products.length;
            totalProfits += order.total;
        });
        const ordersApproved = await Order.countDocuments({ status: "approved" });
        const ordersCanceled = await Order.countDocuments({ status: "canceled" });
        const ordersRejected = await Order.countDocuments({ status: "rejected" });
        const ordersPending = await Order.countDocuments({ status: "pending" });

        const wishlists = await Wishlist.find();
        let productsWished = 0;
        wishlists.forEach((wishlist) => {
            productsWished += wishlist.products.length;
        });

        return res.json({
            totalUsers,
            googleUsers,
            publishedProducts,
            productsOnSale,
            activeSales,
            productsSold,
            totalProfits,
            productsWished,
            ordersApproved,
            ordersCanceled,
            ordersRejected,
            ordersPending,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    verifyAdminRoute,
    getAllUsers,
    getUser,
    getAllOrders,
    promoteUser,
    getUserAddresses,
    getUserOrders,
    getUserWishlist,
    deleteUser,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    getMetrics,
};
