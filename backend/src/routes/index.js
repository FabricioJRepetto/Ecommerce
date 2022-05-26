const { Router } = require("express");
const router = Router();
const { test } = require("../controllers/test");
const productsRouter = require("./products.router");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");

router.use("/product", productsRouter);
router.use("/user", userRouter);
router.use("/cart", cartRouter);
router.get('/test', test);

module.exports = router;
