const { Router } = require("express");
const router = Router();
const {
    getRequest
} = require("../controllers/meli.ctrl.js");

router.get("/search/:search", getRequest);
router.get("/product/:search", getRequest);

module.exports = router;