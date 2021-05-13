const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

/* GET home page. */
router.get('/', async (req, res, next) => {

    let greenhouseGrowth = await scheduleController.getAllActiveGrowth();

    res.render('growth',
        {
            greenhouseGrowth: greenhouseGrowth,
            growth: true,
            info: req.session.alert
        });
    req.session.alert = {};

});

module.exports = router;