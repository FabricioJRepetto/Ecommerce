const { Router } = require('express');
const router = Router();
const { getUserCart, addToCart, removeFromCart, emptyCart } = require('../controllers/cart.ctrl.js');

router.get('/', getUserCart);
router.put('/', addToCart);
router.delete('/', removeFromCart);
router.delete('/', emptyCart);

module.exports = router;