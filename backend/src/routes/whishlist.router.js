const { Router } = require("express");
const router = Router();
const {
    getUserList,
    addToList,
    removeFromList
} = require("../controllers/whishlist.ctrl.js");

router.get("/", getUserList);
router.put("/", addToList);
router.delete("/", removeFromList);

module.exports = router;
