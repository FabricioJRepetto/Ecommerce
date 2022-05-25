const { Router } = require('express');
const router = Router();
const { getAll, getById, createProduct, updateProduct, deleteProduct} = require('../controllers/products.ctrl.js');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createProduct);
router.put('/', updateProduct);
router.delete('/', deleteProduct);

module.exports = router;