const { Router } = require("express");
const router = Router();
const { test } = require('../controllers/test')

router.get("/", (__, res) => {
    res.send('Welcome to eCommerce API.')
});
router.get("/test", (req, res, next) => {
    try {
        test(req)
            .then(r => res.json(r))
    } catch (error) {
        next(error)
    }
});

module.exports = router;
