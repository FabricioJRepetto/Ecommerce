const { Router } = require("express");
const router = Router();
const {
    getHistory,
    getVisited,
    getLastSearch,
    postVisited,
    postSearch,
} = require("../controllers/history.ctrl.js");

router.get("/", getHistory);
router.get("/last_visited", getVisited);
router.get("/last_search", getLastSearch);
router.post("/search/:search", postSearch);
router.post("/visited", postVisited);

module.exports = router;