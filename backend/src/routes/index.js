const { Router } = require("express");
const router = Router();
const { test } = require("../controllers/test");
const productsRouter = require("./products.router");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const whishlistRouter = require("./whishlist.router");
const orderRouter = require("./order.router");
const checkoutRouter = require("./checkout.router");

const verifyToken = require("../middlewares/verifyToken.js");

router.use("/product", productsRouter);
router.use("/user", userRouter);
router.use("/cart", verifyToken, cartRouter);
router.use("/whishlist", verifyToken, whishlistRouter);
router.use("/order", verifyToken, orderRouter);
router.use("/checkout", verifyToken, checkoutRouter);

router.get('/test', test);

module.exports = router;
