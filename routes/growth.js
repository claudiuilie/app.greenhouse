const express = require('express');
const router = express.Router();
const GrowthController = require('../controllers/GrowthController');

/* GET growth page. */
router.get('/', async (req, res, next) => {

    res.render('growth',
        {
            greenhouseGrowth: await GrowthController.getActiveGrowth(),
            growthProgress: await  GrowthController.getActiveGrowthProgress(),
            growth: true,
            info: req.session.alert
        });
    req.session.alert = {};

});

module.exports = router;