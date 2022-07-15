const { Router } = require("express");
const router = Router();
const {
  getOrder,
  getOrdersUser,
  getOrdersAdmin,
  createOrder,
  buyNowOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/order.ctrl.js");

router.get("/userall", getOrdersUser);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.post("/buyNow", buyNowOrder);
router.put("/:id", updateOrder);
router.delete("/", deleteOrder);

module.exports = router;
