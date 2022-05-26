const { Router } = require('express');
const router = Router();
const { getUserCart, addToCart, removeFromCart, emptyCart, deleteCart } = require('../controllers/cart.ctrl.js');

router.get('/', getUserCart);
router.put('/', addToCart);
router.delete('/', removeFromCart);
router.delete('/empty', emptyCart);
router.delete('/delete', deleteCart);

module.exports = router;