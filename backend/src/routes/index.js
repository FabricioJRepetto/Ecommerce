const { Router } = require("express");
const router = Router();
const { test } = require("../controllers/test");
const productsRouter = require("./products.router");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const whishlistRouter = require("./whishlist.router");

router.use("/product", productsRouter);
router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.use("/whishlist", whishlistRouter);
router.get('/test', test);

module.exports = router;
