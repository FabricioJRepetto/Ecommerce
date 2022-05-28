const { Router } = require('express');
const router = Router();
const { 
    getAll, 
    getById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    deleteAll
} = require('../controllers/products.ctrl.js');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/deleteall', deleteAll);
router.delete('/:id', deleteProduct);

module.exports = router;