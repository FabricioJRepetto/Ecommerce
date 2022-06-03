const { Router } = require("express");
const router = Router();
const {
    getUserCart,
    addToCart,
    removeFromCart,
    emptyCart,
    deleteCart,
    quantity,
    quantityEx
} = require("../controllers/cart.ctrl.js");

router.get("/", getUserCart);
router.post("/:id", addToCart);
router.put("/quantity", quantity);
router.put("/quantityEx", quantityEx);
router.delete("/empty", emptyCart);
router.delete("/delete", deleteCart);
router.delete("/:id", removeFromCart);

module.exports = router;
/* pelado 629038b0dd969557733d2eb1
test 628d90b1ba05728fcea1ada3
 */
