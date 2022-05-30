const { Router } = require("express");
const router = Router();
const {
    getUserCart,
    addToCart,
    removeFromCart,
    emptyCart,
    deleteCart,
} = require("../controllers/cart.ctrl.js");
const verifyToken = require("../middlewares/verifyToken.js");

router.get("/", verifyToken, getUserCart);
router.put("/:id", verifyToken, addToCart);
router.delete("/:id", verifyToken, removeFromCart);
router.delete("/empty", verifyToken, emptyCart);
router.delete("/delete", verifyToken, deleteCart);

module.exports = router;
/* pelado 629038b0dd969557733d2eb1
test 628d90b1ba05728fcea1ada3
 */
