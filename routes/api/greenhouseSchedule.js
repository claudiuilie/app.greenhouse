const express = require('express');
const router = express.Router();
const greenhouseSchedule = require('../../services/database/greenhouseSchedule');

/* GET programming languages. */
router.get('/', async function(req, res, next) {
    try {
        let data = await greenhouseSchedule.getMultiple(req.query.page)
        res.body = data;
        res.json(data);
    } catch (err) {
        console.error(`Error while getting programming languages `, err.message);
        next(err);
    }
});

module.exports = router;