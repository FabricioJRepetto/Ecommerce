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

router.get("/userall", getOrdersUser);
router.get("/adminall", getOrdersAdmin);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/", deleteOrder);

module.exports = router;
