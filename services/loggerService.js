const winston = require('winston')
const expressWinston = require('express-winston');

let logger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.cli()
            )
        }),
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.simple()
            ),
            filename: 'logs.log'
        })
    ],
    statusLevels: false, // default value
    level: function (req, res) {
        var level = "";
        if (res.statusCode >= 100) { level = "info"; }
        if (res.statusCode >= 400) { level = "warn"; }
        if (res.statusCode >= 500) { level = "error"; }
        // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
        if (res.statusCode === 401 || res.statusCode === 403) { level = "critical"; }
        // No one should be using the old path, so always warn for those
        if (req.path === "/v1" && level === "info") { level = "warn"; }
        return level;
    },
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg:msgHandler, // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
});

function msgHandler(req, res) {
// console.log(res)
    return JSON.stringify({
        reqError: res.req.err,
        details: res.locals,
        reqBody: req.body,
        resBody: req.headers,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: res.responseTime + " ms"
    });
}
module.exports = {
    logger
}