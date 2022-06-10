const { Router } = require("express");
const router = Router();
const {
    getOrder,
    getOrdersUser,
    getOrdersAdmin,
    createOrder,
    deleteOrder,
    updateOrder
} = require("../controllers/order.ctrl.js");

router.get("/", createOrder);
router.get("/userall", getOrdersUser);
router.get("/adminall", getOrdersAdmin);
router.get("/:id", getOrder);
router.put("/:id", updateOrder);
router.delete("/", deleteOrder);

module.exports = router;
