const greenhouseController = require('../controllers/greenhouseController');
const soilService = require('../services/database/soilSettingsService');
const tankService = require('../services/database/tankSettingsService');
const eventsService = require('../services/database/eventsDbService');
const soilMoistureHelper = require('../helpers/soilMoistureHelper')

async function getGreenhouseStatus() {
    let greenhouseStatus = await greenhouseController.getStats();
    let soilMoistureSettings = await soilService.getSoilSettings();

    if(soilMoistureSettings != null && greenhouseStatus != null){
        const s1 = greenhouseStatus.soil_moisture_1;
        const s2 = greenhouseStatus.soil_moisture_2;
        const dry = soilMoistureSettings.dry;
        const wet = soilMoistureSettings.wet;
        greenhouseStatus["percentage_moisture_1"] = soilMoistureHelper.moisturePercent(s1,dry,wet);
        greenhouseStatus["percentage_moisture_2"] = soilMoistureHelper.moisturePercent(s2,dry,wet);
    }

    return greenhouseStatus;
}

async function getGreenhouseTempHistory(greenhouseHistory) {

    const greenhouseTempHistory = {data: [], labels: []};

    if (greenhouseHistory != null) {
        for (let k = greenhouseHistory.length - 1; k >= 0; k--) {
            if (greenhouseHistory[k].temperature != null) {
                greenhouseTempHistory.data.push(greenhouseHistory[k].temperature);
                greenhouseTempHistory.labels.push(1);
            }
        }
    }
    return greenhouseTempHistory;
}

async function getGreenhouseHumHistory(greenhouseHistory) {

    const greenhouseHumHistory = {data: [], labels: []};

    if (greenhouseHistory != null) {
        for (let k = greenhouseHistory.length - 1; k >= 0; k--) {
            if (greenhouseHistory[k].humidity != null) {
                greenhouseHumHistory.data.push(greenhouseHistory[k].humidity);
                greenhouseHumHistory.labels.push(1);
            }
        }
    }
    return greenhouseHumHistory;
}

async function getGreenhouseSoilHistory1(greenhouseHistory) {

    const greenhouseSoilHistory1 = {data: [], labels: []};
    if (greenhouseHistory != null) {
        for (let k = greenhouseHistory.length - 1; k >= 0; k--) {
            if (greenhouseHistory[k].soil_moisture_1 != null) {
                greenhouseSoilHistory1.data.push(greenhouseHistory[k].soil_moisture_1);
                greenhouseSoilHistory1.labels.push(1);
            }
        }
    }
    return greenhouseSoilHistory1;
}

async function getGreenhouseSoilHistory2(greenhouseHistory) {

    const greenhouseSoilHistory2 = {data: [], labels: []};
    if (greenhouseHistory != null) {
        for (let k = greenhouseHistory.length - 1; k >= 0; k--) {
            if (greenhouseHistory[k].soil_moisture_2 != null) {
                greenhouseSoilHistory2.data.push(greenhouseHistory[k].soil_moisture_2);
                greenhouseSoilHistory2.labels.push(1);
            }
        }
    }
    return greenhouseSoilHistory2;
}

async function getWaterTankLevel(greenhouseStatus) {
    let waterTankSettings = await tankService.getTankSettings();

    if(waterTankSettings != null && greenhouseStatus!= null){
        let c = waterTankSettings.height - greenhouseStatus.water_level;
        waterTankSettings["current_capacity"] = (waterTankSettings.length * waterTankSettings.width * c / 1000000).toFixed(2);
        waterTankSettings["max_capacity"] = (waterTankSettings.length * waterTankSettings.width * waterTankSettings.height / 1000000).toFixed(2);
    }

    return waterTankSettings;
}

async function getEvents() {
    const waterTankSettings = await tankService.getTankSettings();
    const events = await eventsService.getGreenhouseEvents();
    if(events != null && waterTankSettings != null){
        for (let k in events)
            if(events[k].function_name === 'setPomp')
                events[k].event_value = parseInt(events[k].event_value.split(":")[0]*2*waterTankSettings.ml_s);

    }
    return events;
}

module.exports = {
    getGreenhouseStatus,
    getWaterTankLevel,
    getGreenhouseHumHistory,
    getGreenhouseTempHistory,
    getGreenhouseSoilHistory1,
    getGreenhouseSoilHistory2,
    getEvents
}