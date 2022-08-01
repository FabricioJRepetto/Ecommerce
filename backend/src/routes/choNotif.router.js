const { Router } = require("express");
const router = Router();
const { checkoutNotif } = require('../controllers/choNotif.router.js');

router.post('/', checkoutNotif);

module.exports = router;