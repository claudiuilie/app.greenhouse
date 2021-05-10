const express = require('express');
const router = express.Router();
const greenhouseController = require('../controllers/greenhouseController');
const historyController = require('../controllers/historyController');
const scheduleController = require('../controllers/scheduleController');

/* GET home page. */
router.get('/', async (req, res, next) => {

    let greenhouseHistory = await historyController.getLastDayHistory();
    let greenhouseStatus = await greenhouseController.getStats();
    let waterTankSettings = await scheduleController.getTankSettings();
    let soilMoistureSettings = await scheduleController.getSoilSettings();
    let greenhouseTempHistory = {data: [], labels: []};
    let greenhouseHumHistory = {data: [], labels: []};
    let greenhouseSoilHistory1 = {data: [], labels: []};
    let greenhouseSoilHistory2 = {data: [], labels: []};

    if(waterTankSettings != null){
        let c = waterTankSettings.height - greenhouseStatus.water_level;
        waterTankSettings["current_capacity"] = (waterTankSettings.length * waterTankSettings.width * c / 1000000).toFixed(2);
        waterTankSettings["max_capacity"] = (waterTankSettings.length * waterTankSettings.width * waterTankSettings.height / 1000000).toFixed(2);
    }

    if(soilMoistureSettings != null){
        const x = greenhouseStatus.soil_moisture_1;
        const y = greenhouseStatus.soil_moisture_2;
        const dry = soilMoistureSettings.dry;
        const wet = soilMoistureSettings.wet;
        greenhouseStatus["percentage_moisture_1"] = ((x - dry) * 100 / (wet - dry)).toFixed(2);
        greenhouseStatus["percentage_moisture_2"] = ((y - dry) * 100 / (wet - dry)).toFixed(2);
    }
    
    if (greenhouseHistory != null) {
        for (let k = greenhouseHistory.length - 1; k >= 0; k--) {
            if (greenhouseHistory[k].temperature != null) {
                greenhouseTempHistory.data.push(greenhouseHistory[k].temperature);
                greenhouseTempHistory.labels.push(1);
                greenhouseHumHistory.data.push(greenhouseHistory[k].humidity);
                greenhouseHumHistory.labels.push(1);
                greenhouseSoilHistory1.data.push(greenhouseHistory[k].soil_moisture_1);
                greenhouseSoilHistory1.labels.push(1);
                greenhouseSoilHistory2.data.push(greenhouseHistory[k].soil_moisture_2);
                greenhouseSoilHistory2.labels.push(1);
            }
        }
    }

    res.render('home', {
        history: greenhouseHistory,
        status: greenhouseStatus,
        tank: waterTankSettings,
        tempHistory: greenhouseTempHistory,
        humHistory: greenhouseHumHistory,
        soilHistory_1: greenhouseSoilHistory1,
        soilHistory_2: greenhouseSoilHistory2,
        home: true,
        info: req.session.alert
    });

    req.session.alert = {};
});

router.post('/lights', async (req, res) => {

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

router.post('/fan', async (req, res) => {

    let fanName = req.body.name;
    let fanStatus = parseInt(req.body.status);
    switch (fanName) {
        case "fanIn" :
            await greenhouseController.setFanIn(fanStatus ? 102 : 0);
            req.session.alert = {
                type: 'info',
                text: `Fan in ${fanStatus ? 'started' : 'stopped'}.`
            }
            break;
        case "fanOut" :
            await greenhouseController.setFanOut(fanStatus ? 102 : 0);
            req.session.alert = {
                type: 'info',
                text: `Fan out ${fanStatus ? 'started' : 'stopped'}.`
            }
            break;
        default:
            req.session.alert = {
                type: 'danger',
                text: `Invalid fan name ${fanName}`
            }
    }

    res.redirect('/');
});

router.post('/pomp', async (req, res) => {

    let pompName = req.body.name;
    let pompStatus = parseInt(req.body.status);

    switch (pompName) {
        case "pomp" :
            await greenhouseController.pomp(pompStatus);
            req.session.alert = {
                type: 'info',
                text: `Pomp ${pompStatus ? 'started' : 'stopped'}.`
            }
            break;
        default:
            req.session.alert = {
                type: 'danger',
                text: `Invalid pomp name ${pompName}`
            }
    }

    res.redirect('/');
});

module.exports = router;



