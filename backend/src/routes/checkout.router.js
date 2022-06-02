const { Router } = require("express");
const router = Router();
const {
    create
} = require("../controllers/checkout.ctrl.js");

router.get("/", create);

module.exports = router;