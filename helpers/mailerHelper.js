const mailService = require('../services/mailService')
const MailOptions = require('../models/MailOptions');
const DateAndTime = require('../helpers/dateAndTimeHelper');
const chartService = require('../services/chartService');

const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const appDir = path.dirname(require.main.path);
const templateSource = fs.readFileSync(path.join(appDir, 'public','template','dailyReportTemplate.hbs'), 'utf8');
const template = Handlebars.compile(templateSource);

async function sendLastDayReport() {

    const tempHistoryChart = await chartService.dailyTempHistoryChart();
    const humHistoryChart = await  chartService.dailyHumHistoryChart();

    const date = new DateAndTime();
    const mailOptions = {
        from : process.env.MAIL_TRANSPORTER_SENDER,
        to : process.env.MAIL_TRANSPORTER_RECEIVER,
        subject : `Last day report - ${date.getYesterday()}`,
        html: template({
            tempHistoryChart: tempHistoryChart.getUrl(),
            humHistoryChart: humHistoryChart.getUrl()
        })
    }

    await mailService.sendMail(mailOptions);
}

async function sendTodayReport() {
    const tempHistoryChart = await chartService.todayTempHistoryChart();
    const humHistoryChart = await  chartService.todayHumHistoryChart();

    const date = new DateAndTime();
    const mailOptions = {
        from : process.env.MAIL_TRANSPORTER_SENDER,
        to : process.env.MAIL_TRANSPORTER_RECEIVER,
        subject : `Today report - ${date.getCurrentDate()}`,
        html: template({
            tempHistoryChart: tempHistoryChart.getUrl(),
            humHistoryChart: humHistoryChart.getUrl()
        })
    }

    await mailService.sendMail(mailOptions);
}

module.exports = {
    sendLastDayReport,
    sendTodayReport
}