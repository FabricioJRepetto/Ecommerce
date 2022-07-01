const { Router } = require("express");
const router = Router();
const { test } = require("../controllers/test");
const productsRouter = require("./products.router");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const whishlistRouter = require("./whishlist.router");
const addressRouter = require("./address.router");
const orderRouter = require("./order.router");
const historyRouter = require("./history.router");
const checkoutRouter = require("./checkout.router");
const mpRouter = require("./mercadopago.router");
const salesRouter = require("./sales.router");
const meliRouter = require("./meli.router");
const { verifyToken } = require("../middlewares/verify");

router.use("/user", userRouter);
router.use("/cart", verifyToken, cartRouter);
router.use("/whishlist", verifyToken, whishlistRouter);
router.use("/order", verifyToken, orderRouter);
router.use("/address", verifyToken, addressRouter);
router.use("/history", verifyToken, historyRouter);
router.use("/product", productsRouter);
router.use("/sales", salesRouter);
router.use("/checkout", verifyToken, checkoutRouter);
router.use("/mercadopago", verifyToken, mpRouter);
router.use("/meli", meliRouter);

router.get("/test", test);

module.exports = router;
