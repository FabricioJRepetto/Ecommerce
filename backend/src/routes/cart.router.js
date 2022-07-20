const { Router } = require("express");
const router = Router();
const {
    getUserCart,
    setBuyNow,
    buyLater,
    addToCart,
    removeFromCart,
    emptyCart,
    deleteCart,
    quantity,
    quantityEx
} = require("../controllers/cart.ctrl.js");

router.get("/", getUserCart);
router.post("/", setBuyNow);
router.post("/:id", addToCart);
router.post("/buylater/:id", buyLater);
router.put("/quantity", quantity);
router.put("/quantityEx", quantityEx);
router.delete("/empty", emptyCart);
router.delete("/delete", deleteCart);
router.delete("/", removeFromCart);

module.exports = router;