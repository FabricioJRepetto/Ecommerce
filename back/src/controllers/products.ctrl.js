

const getAll = (req, res, next) => {
    res.json('all products');
};
const getById = (req, res, next) => {
    res.json('one product');
};
const createProduct = (req, res, next) => {
    res.json('product created');
};
const updateProduct = (req, res, next) => {
    res.json('product updated');
};
const deleteProduct = (req, res, next) => {
    res.json('product deleted')
};

module.exports = {
    getAll,
    getById,
    createProduct,
    updateProduct,
    deleteProduct
}