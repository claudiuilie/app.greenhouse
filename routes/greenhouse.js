const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const greenhouseController = require('../controllers/greenhouseController');
const historyController = require('../controllers/historyController');

/* GET home page. */
router.get('/', async (req, res, next) => {

    let greenhouseScheduler = await scheduleController.getAllSchedules();
    let greenhouseHistory = await historyController.getLastDayHistory();
    let greenhouseStatus = await greenhouseController.getStats();
    let greenhouseTempHistory = {data: [], labels: []};
    let greenhouseHumHistory = {data: [], labels: []};
    let greenhouseSoilHistory = {data: [], labels: []};

    if (greenhouseHistory != null) {
        for (let k = greenhouseHistory.length - 1; k >= 0; k--) {
            if (greenhouseHistory[k].temperature != null) {
                greenhouseTempHistory.data.push(greenhouseHistory[k].temperature);
                greenhouseTempHistory.labels.push(1);
                greenhouseHumHistory.data.push(greenhouseHistory[k].humidity);
                greenhouseHumHistory.labels.push(1);
                greenhouseSoilHistory.data.push(greenhouseHistory[k].soil_moisture);
                greenhouseSoilHistory.labels.push(1);
            }
        }
    }

    res.render('home', {
        scheduler: greenhouseScheduler,
        history: greenhouseHistory,
        status: greenhouseStatus,
        tempHistory: greenhouseTempHistory,
        humHistory: greenhouseHumHistory,
        soilHistory: greenhouseSoilHistory,
        info: req.session.alert
    });

    req.session.alert = {};
});

router.post('/lights', async (req, res, next) => {
    let query;
    let lightName = req.body.name;
    let lightStatus = parseInt(req.body.status);

    switch (lightName) {
        case "vegPhase" :
            await greenhouseController.setVegLamp(!lightStatus);
            req.session.alert = {
                type: 'info',
                text: `Veg lights ${!lightStatus ? 'started' : 'stopped'}.`
            }
            break;
        case "fruitPhase" :
            await greenhouseController.setFruitLamp(!lightStatus);
            req.session.alert = {
                type: 'info',
                text: `Flower lights ${!lightStatus ? 'started' : 'stopped'}.`
            }
            break;
        default:
            req.session.alert = {
                type: 'danger',
                text: `Invalid light name ${lightName}`
            }
    }

    res.redirect('/');
});

module.exports = router;



