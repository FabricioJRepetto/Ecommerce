const { Router } = require("express");
const router = Router();
const {
    getUserList,
    addToList,
    removeFromList
} = require("../controllers/whishlist.ctrl.js");

router.get("/", getUserList);
router.put("/:id", addToList);
router.delete("/:id", removeFromList);

module.exports = router;
