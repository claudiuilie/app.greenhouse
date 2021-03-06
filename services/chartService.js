const chartHelper = require('../helpers/chartHelper');
const ChartJsImage = require('chartjs-to-image');
const mailerChartConfig = {
    type: 'line',
    data: null,
    options: {
        responsive: true,
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                }
            }
        }
    }
}

async function dailyTempHistoryChart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.lastDayHistoryLabels();
    const dataSet = await chartHelper.lastDayTempHistoryChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

async function dailyHumHistoryChart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.lastDayHistoryLabels();
    const dataSet = await chartHelper.lastDayHumHistoryChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

async function dailySoil1Chart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.lastDayHistoryLabels();
    const dataSet = await chartHelper.lastDaySoil1ChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

async function dailySoil2Chart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.lastDayHistoryLabels();
    const dataSet = await chartHelper.lastDaySoil2ChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

async function todayTempHistoryChart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.todayHistoryLabels();
    const dataSet = await chartHelper.todayTempHistoryChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

async function todayHumHistoryChart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.todayHistoryLabels();
    const dataSet = await chartHelper.todayHumHistoryChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

async function todaySoil1Chart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.todayHistoryLabels();
    const dataSet = await chartHelper.todaySoil1ChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

async function todaySoil2Chart() {
    const chart = new ChartJsImage();
    const labels = await chartHelper.todayHistoryLabels();
    const dataSet = await chartHelper.todaySoil2ChartSet();
    mailerChartConfig.data = {labels: labels, datasets: [dataSet]}
    chart.setConfig(mailerChartConfig);
    return chart;
}

module.exports = {
    dailyTempHistoryChart,
    dailyHumHistoryChart,
    todayTempHistoryChart,
    todayHumHistoryChart,
    dailySoil1Chart,
    dailySoil2Chart,
    todaySoil2Chart,
    todaySoil1Chart
}