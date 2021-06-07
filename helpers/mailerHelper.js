const mailService = require('../services/mailService')
const MailOptions = require('../models/MailOptions');
const DateAndTime = require('../helpers/dateAndTimeHelper');
const chartService = require('../services/chartService');
const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const appDir = path.dirname(require.main.path);
const templateSource = fs.readFileSync(path.join(appDir, 'public', 'template', 'dailyReportTemplate.hbs'), 'utf8');
const template = Handlebars.compile(templateSource);

async function sendLastDayReport() {

    const tempHistoryChart = await chartService.dailyTempHistoryChart();
    const humHistoryChart = await chartService.dailyHumHistoryChart();
    const soilMoisture1Chart = await chartService.dailySoil1Chart();
    const soilMoisture2Chart = await chartService.dailySoil2Chart();

    const date = new DateAndTime();
    const mailOptions = new MailOptions();
    mailOptions.from = process.env.MAIL_TRANSPORTER_SENDER;
    mailOptions.to = process.env.MAIL_TRANSPORTER_RECEIVER;
    mailOptions.subject = `Last day report - ${date.getYesterday()}`;
    mailOptions.html = template({
        tempHistoryChart: tempHistoryChart.getUrl(),
        humHistoryChart: humHistoryChart.getUrl(),
        soilMoisture1Chart: soilMoisture1Chart.getUrl(),
        soilMoisture2Chart: soilMoisture2Chart.getUrl()
    });
    mailService.sendMail.prototype = 'sendLastDayReport';
    return await mailService.sendMail(mailOptions.toObject());
}

async function sendTodayReport() {
    const tempHistoryChart = await chartService.todayTempHistoryChart();
    const humHistoryChart = await chartService.todayHumHistoryChart();
    const soilMoisture1Chart = await chartService.todaySoil1Chart();
    const soilMoisture2Chart = await chartService.todaySoil2Chart();

    const date = new DateAndTime();
    const mailOptions = new MailOptions();
    mailOptions.from = process.env.MAIL_TRANSPORTER_SENDER;
    mailOptions.to = process.env.MAIL_TRANSPORTER_RECEIVER;
    mailOptions.subject = `Today report - ${date.getCurrentDate()}`;
    mailOptions.html = template({
        tempHistoryChart: tempHistoryChart.getUrl(),
        humHistoryChart: humHistoryChart.getUrl(),
        soilMoisture1Chart: soilMoisture1Chart.getUrl(),
        soilMoisture2Chart: soilMoisture2Chart.getUrl()
    });
    mailService.sendMail.prototype = 'sendTodayReport';
    return await mailService.sendMail(mailOptions.toObject());
}

module.exports = {
    sendLastDayReport,
    sendTodayReport
}