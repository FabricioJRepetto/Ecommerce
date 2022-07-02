const { Router } = require("express");
const router = Router();
const {
    getRequest,
    getProduct,
    getItem,
} = require("../controllers/meli.ctrl.js");

router.get("/search/:search", getRequest);
router.get("/product/:id", getProduct);
router.get("/item/:id", getItem);

module.exports = router;