const { Router } = require("express");
const router = Router();
const {
    getSales,
    setNewSales,
    resetSales
} = require("../controllers/sales.ctrl.js");

router.get("/", getSales);
router.get("/set_new_sales", setNewSales);
router.delete("/", resetSales);

module.exports = router;