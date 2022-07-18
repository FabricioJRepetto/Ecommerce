const { Router } = require("express");
const router = Router();
const {
  getAll,
  getByQuery,
  getById,
  stock,
} = require("../controllers/products.ctrl.js");

router.get("/", getAll);
router.get("/search", getByQuery);
router.get("/:id", getById);
router.put("/stock/", stock);

module.exports = router;
