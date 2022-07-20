const { Router } = require("express");
const router = Router();
const {
  verifyAdminRoute,
  getAllUsers,
  getUser,
  getAllOrders,
  promoteUser,
  getUserAddresses,
  getUserOrders,
  getUserWishlist,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  getMetrics,
} = require("../controllers/admin.ctrl");

//router.get("/verifyAdmin", verifyAdminRoute);
router.get("/verify", verifyAdminRoute);

//router.get("/getAllUsers", getAllUsers);
//router.get("/getUser/:id", getUser);
//router.get("/getAllOrders", getAllOrders);
//router.put("/promote/:id", promoteUser);
//router.post("/getUserAddresses", getUserAddresses);
//router.post("/getUserOrders", getUserOrders);
//router.post("/getUserWishlist", getUserWishlist);
//router.delete("/:id", deleteUser);

router.get("/user/getAll", getAllUsers);
router.get("/user/:id", getUser);
router.get("/order/getAll", getAllOrders);
router.put("/user/promote/:id", promoteUser);
router.post("/user/getAddresses", getUserAddresses);
router.post("/user/getOrders", getUserOrders);
router.post("/user/getWishlist", getUserWishlist);
router.delete("/user/:id", deleteUser);

router.post("/product/", createProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/deleteall", deleteAllProducts);
router.delete("/product/:id", deleteProduct);
/* router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/deleteall", deleteAllProducts);
router.delete("/:id", deleteProduct); */

router.get("/metrics", getMetrics);

module.exports = router;
