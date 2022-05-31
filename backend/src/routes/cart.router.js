const { Router } = require("express");
const router = Router();
const {
    getUserCart,
    addToCart,
    removeFromCart,
    emptyCart,
    deleteCart,
} = require("../controllers/cart.ctrl.js");

router.get("/", getUserCart);
router.put("/:id", addToCart);
router.delete("/:id", removeFromCart);
router.delete("/empty", emptyCart);
router.delete("/delete", deleteCart);

module.exports = router;
/* pelado 629038b0dd969557733d2eb1
test 628d90b1ba05728fcea1ada3
 */
