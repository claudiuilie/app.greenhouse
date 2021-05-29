const greenhouseHistoryService = require('../services/database/greenhouseHistoryService');
const ChartDataSet = require('../models/ChartDataSet');

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
    todayHumHistoryChartSet
}