const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const pompController = require('../controllers/pompController');
const fanController = require('../controllers/fanController');
const lightsController = require('../controllers/lightsController');
const historyService = require('../services/database/greenhouseHistoryService')

/* GET home page. */
router.get('/', async (req, res, next) => {

    const greenhouseHistory = await historyService.getLasDayHistory();
    const greenhouseStatus = await homeController.getGreenhouseStatus();

    res.render('home', {
        history: greenhouseHistory,
        status: greenhouseStatus,
        tank: await homeController.getWaterTankLevel(greenhouseStatus),
        events: await homeController.getEvents(),
        tempHistory: await homeController.getGreenhouseTempHistory(greenhouseHistory),
        humHistory: await homeController.getGreenhouseHumHistory(greenhouseHistory),
        soilHistory_1: await homeController.getGreenhouseSoilHistory1(greenhouseHistory),
        soilHistory_2: await homeController.getGreenhouseSoilHistory2(greenhouseHistory),
        home: true,
        info: req.session.alert
    });

    req.session.alert = {};
});

router.post('/lights', async (req, res) => {

    const lightName = req.body.name;
    const lightStatus = parseInt(req.body.status);
    req.session.alert = await lightsController.setLights(lightName, lightStatus);
    res.redirect('/');
});

router.post('/fan', async (req, res) => {
    const fanName = req.body.name;
    const fanStatus = parseInt(req.body.status);
    req.session.alert = await fanController.setFan(fanName, fanStatus);
    res.redirect('/');
});

router.post('/pomp', async (req, res) => {
    const pompName = req.body.name;
    const pompStatus = parseInt(req.body.status);
    req.session.alert = await pompController.setPomp(pompName, pompStatus);
    res.redirect('/');
});

module.exports = router;