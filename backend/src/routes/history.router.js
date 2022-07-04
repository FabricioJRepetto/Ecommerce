const { Router } = require("express");
const router = Router();
const {
    getHistory,
    getSuggestion,
    postVisited,
    postSearch,
} = require("../controllers/history.ctrl.js");

router.get("/", getHistory);
router.get("/suggestion", getSuggestion);
router.post("/search/:search", postSearch);
router.post("/visited", postVisited);

module.exports = router;