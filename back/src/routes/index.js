const { Router } = require("express");
const router = Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { test } = require("../controllers/test");
const productsRouter = require("./products.router");
const userRouter = require("./user.router");

router.use("/product", productsRouter);
router.use("/user", userRouter);
router.get('/test', test);

module.exports = router;
