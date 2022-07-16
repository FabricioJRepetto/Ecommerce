const { Router } = require("express");
const router = Router();

const {
  verifyAdminRoute,
  promoteUser,
  getAllUsers,
  getAddressesAdmin,
  getOrdersAdmin,
  getWishlistAdmin,
  deleteUser,
} = require("../controllers/admin.ctrl");

router.get("/verifyAdmin", verifyAdminRoute);
router.put("/promote/:id", promoteUser);
router.get("/getAllUsers", getAllUsers);
router.post("/getAddresses", getAddressesAdmin);
router.post("/getOrders", getOrdersAdmin);
router.post("/getWishlist", getWishlistAdmin);
router.delete("/:id", deleteUser);

module.exports = router;
