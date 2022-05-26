const { Router } = require("express");
const router = Router();
const {
  getUserCart,
  addToCart,
  removeFromCart,
  emptyCart,
  deleteCart,
} = require("../controllers/cart.ctrl.js");
const verifyUser = require("../middlewares/verifyUser.js");

router.get("/", verifyUser, getUserCart);
router.put("/", verifyUser, addToCart);
router.delete("/", verifyUser, removeFromCart);
router.delete("/empty", verifyUser, emptyCart);
router.delete("/delete", verifyUser, deleteCart);

module.exports = router;
