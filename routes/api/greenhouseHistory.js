const express = require('express');
const router = express.Router();
const greenhouseHistory = require('../../services/database/greenhouseHistory');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
    try {
        let data = await greenhouseHistory.getMultiple(req.query.page)
        res.body = data;
        res.json(data);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
});

module.exports = router;