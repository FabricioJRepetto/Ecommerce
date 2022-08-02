const { Router } = require("express");
const router = Router();
const {
    notificationStripe,
    notificationMercadopago
} = require('../controllers/choNotif.router.js');

router.post('/', notificationMercadopago);
router.post('/s', notificationStripe);

module.exports = router;