const { Router } = require("express");
const router = Router();
const {
    getOrder,
    createOrder,
    deleteOrder
} = require("../controllers/order.ctrl.js");

router.get("/", getOrder);
router.get("/all", getOrder);
router.post("/", createOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
