const { Router } = require("express");
const router = Router();
const {
    mpCho,
    notifications
} = require("../controllers/mercadopago.ctrl.js");

router.get("/:id", mpCho);
//! es un POST o una GET ???
router.get("/ipn", notifications);

module.exports = router;