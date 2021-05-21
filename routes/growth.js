const express = require('express');
const router = express.Router();
const growthController = require('../controllers/growthController');


/* GET growth page. */
router.get('/', async (req, res, next) => {

    res.render('growth',
        {
            greenhouseGrowth: await growthController.getActiveGrowth(),
            growthProgress: await  growthController.getActiveGrowthProgress(),
            growth: true,
            info: req.session.alert
        });
    req.session.alert = {};

});

module.exports = router;