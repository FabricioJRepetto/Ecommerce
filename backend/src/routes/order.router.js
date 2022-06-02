const { Router } = require("express");
const router = Router();
const {
    getOrder,
    getOrdersUser,
    getOrdersAdmin,
    createOrder,
    deleteOrder
} = require("../controllers/order.ctrl.js");

router.get("/:id", getOrder);
router.get("/userall", getOrdersUser);
router.get("/adminall", getOrdersAdmin);
router.post("/", createOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
