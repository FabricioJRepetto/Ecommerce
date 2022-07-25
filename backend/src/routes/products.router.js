const { Router } = require("express");
const router = Router();
const {
    getAll,
    getByQuery,
    getById,
    stock,
    getPromos,
} = require("../controllers/products.ctrl.js");

router.get("/", getAll);
router.get("/search", getByQuery);
router.get("/:id", getById);
router.put("/stock/", stock);
router.get("/promos", getPromos);

module.exports = router;
