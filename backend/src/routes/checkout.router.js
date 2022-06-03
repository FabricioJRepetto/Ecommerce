const { Router } = require("express");
const router = Router();
const {
    create
} = require("../controllers/checkout.ctrl.js");

router.post("/", create);

module.exports = router;