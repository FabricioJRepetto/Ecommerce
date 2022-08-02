const { Router } = require("express");
const router = Router();
const {
    notificationStripe,
    notificationMercadopago
} = require('../controllers/choNotif.router.js');

router.post('/s', notificationStripe);
router.post('/mp', notificationMercadopago);

module.exports = router;