const { Router } = require("express");
const router = Router();
const productsRouter = require("./products.router");
const userRouter = require("./user.router");
const cartRouter = require("./cart.router");
const whishlistRouter = require("./whishlist.router");
const addressRouter = require("./address.router");
const orderRouter = require("./order.router");
const historyRouter = require("./history.router");
const stripeRouter = require("./stripe.router");
const mpRouter = require("./mercadopago.router");
const salesRouter = require("./sales.router");
const { verifyToken } = require("../middlewares/verify");

router.use("/user", userRouter);
router.use("/cart", verifyToken, cartRouter);
router.use("/whishlist", verifyToken, whishlistRouter);
router.use("/order", verifyToken, orderRouter);
router.use("/address", verifyToken, addressRouter);
router.use("/history", verifyToken, historyRouter);
router.use("/product", productsRouter);
router.use("/sales", salesRouter);
router.use("/stripe", verifyToken, stripeRouter);
router.use("/mercadopago", verifyToken, mpRouter);

module.exports = router;
