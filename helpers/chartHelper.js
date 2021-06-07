const greenhouseHistoryService = require('../services/database/greenhouseHistoryService');
const ChartDataSet = require('../models/ChartDataSet');
const soilMoistureHelper = require('../helpers/soilMoistureHelper');
const soilService = require('../services/database/soilSettingsService');

async function lastDayTempHistoryChartSet(){
    const history = await greenhouseHistoryService.getDailyHistory();
    const dataSet = new ChartDataSet();
    dataSet.label = "Temperature";
    dataSet.borderColor = "orange";
    dataSet.backgroundColor = "orange";

    for(let k in history)
        dataSet.addToData(history[k].temperature);

    return dataSet.toObject();
}

async function todayTempHistoryChartSet(){
    const history = await greenhouseHistoryService.getTodayHistory();
    const dataSet = new ChartDataSet();
    dataSet.label = "Temperature";
    dataSet.borderColor = "orange";
    dataSet.backgroundColor = "orange";

    for(let k in history)
        dataSet.addToData(history[k].temperature);

    return dataSet.toObject();
}

async function lastDayHumHistoryChartSet(){
    const history = await greenhouseHistoryService.getDailyHistory();
    const dataSet = new ChartDataSet();
    dataSet.label = "Humidity";
    dataSet.borderColor = "blue";
    dataSet.backgroundColor = "blue";

    for(let k in history)
        dataSet.addToData(history[k].humidity);

    return dataSet.toObject();
}

async function lastDaySoil1ChartSet(){
    const history = await greenhouseHistoryService.getDailyHistory();
    const soilMoistureSettings = await soilService.getSoilSettings();
    const dry = soilMoistureSettings.dry;
    const wet = soilMoistureSettings.wet;
    const dataSet = new ChartDataSet();
    dataSet.label = "Soil Moisture 1";
    dataSet.borderColor = "brown";
    dataSet.backgroundColor = "brown";

    for(let k in history)
        dataSet.addToData(soilMoistureHelper.moisturePercent(history[k].soil_moisture_1,dry,wet));

    return dataSet.toObject();
}

async function lastDaySoil2ChartSet(){
    const history = await greenhouseHistoryService.getDailyHistory();
    const soilMoistureSettings = await soilService.getSoilSettings();
    const dry = soilMoistureSettings.dry;
    const wet = soilMoistureSettings.wet;
    const dataSet = new ChartDataSet();
    dataSet.label = "Soil Moisture 2";
    dataSet.borderColor = "brown";
    dataSet.backgroundColor = "brown";

    for(let k in history)
        dataSet.addToData(soilMoistureHelper.moisturePercent(history[k].soil_moisture_2,dry,wet));

    return dataSet.toObject();
}

async function todayHumHistoryChartSet(){
    const history = await greenhouseHistoryService.getTodayHistory();
    const dataSet = new ChartDataSet();
    dataSet.label = "Humidity";
    dataSet.borderColor = "blue";
    dataSet.backgroundColor = "blue";

    for(let k in history)
        dataSet.addToData(history[k].humidity);

    return dataSet.toObject();
}

async function todaySoil1ChartSet(){
    const history = await greenhouseHistoryService.getTodayHistory();
    const soilMoistureSettings = await soilService.getSoilSettings();
    const dry = soilMoistureSettings.dry;
    const wet = soilMoistureSettings.wet;
    const dataSet = new ChartDataSet();
    dataSet.label = "Soil Moisture 1";
    dataSet.borderColor = "brown";
    dataSet.backgroundColor = "brown";

    for(let k in history)
        dataSet.addToData(soilMoistureHelper.moisturePercent(history[k].soil_moisture_1,dry,wet));

    return dataSet.toObject();
}

async function todaySoil2ChartSet(){
    const history = await greenhouseHistoryService.getTodayHistory();
    const dataSet = new ChartDataSet();
    const soilMoistureSettings = await soilService.getSoilSettings();
    const dry = soilMoistureSettings.dry;
    const wet = soilMoistureSettings.wet;
    dataSet.label = "Soil Moisture 2";
    dataSet.borderColor = "brown";
    dataSet.backgroundColor = "brown";

    for(let k in history)
        dataSet.addToData(soilMoistureHelper.moisturePercent(history[k].soil_moisture_2,dry,wet));

    return dataSet.toObject();
}


async function lastDayHistoryLabels() {
    const labels = [];
    const history = await greenhouseHistoryService.getDailyHistory();
    for(let k in history)
        labels.push(history[k].hour);

    return labels;
}

async function todayHistoryLabels() {
    const labels = [];
    const history = await greenhouseHistoryService.getTodayHistory();
    for(let k in history)
        labels.push(history[k].hour);

    return labels;
}

module.exports = {
    lastDayHistoryLabels,
    lastDayHumHistoryChartSet,
    lastDayTempHistoryChartSet,
    todayHistoryLabels,
    todayTempHistoryChartSet,
    todayHumHistoryChartSet,
    lastDaySoil1ChartSet,
    lastDaySoil2ChartSet,
    todaySoil1ChartSet,
    todaySoil2ChartSet
}