const { Router } = require("express");
const router = Router();
const {
  getAll,
  getByQuery,
  getById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAll,
  stock,
} = require("../controllers/products.ctrl.js");

router.get("/", getAll);
router.get("/search", getByQuery);
router.get("/:id", getById);
router.post("/", createProduct);
router.put("/updateStock/", stock);
router.put("/:id", updateProduct);
router.delete("/deleteall", deleteAll);
router.delete("/:id", deleteProduct);

module.exports = router;
