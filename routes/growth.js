const express = require('express');
const router = express.Router();
const growthService = require('../services/database/growthService');

/* GET home page. */
router.get('/', async (req, res, next) => {

    let greenhouseGrowth = await growthService.getActiveGrowth();

    res.render('growth',
        {
            greenhouseGrowth: greenhouseGrowth,
            growth: true,
            info: req.session.alert
        });
    req.session.alert = {};

});

module.exports = router;