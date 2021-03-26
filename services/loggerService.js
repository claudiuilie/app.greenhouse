const winston = require('winston')
const expressWinston = require('express-winston');
const path = require('path');

let consoleLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.cli()
            )
        })
    ],
    statusLevels: false, // default value
    level: levelHandler,
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg:msgHandler, // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
});

let fileLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                winston.format.json()
            ),
            filename: path.join(process.env.LOGS_FILE)
        })
    ],
    statusLevels: false, // default value
    level: levelHandler,
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg:msgHandler, // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: routeHandler // optional: allows to skip some log messages based on request and/or response
});


function routeHandler(req) {
    let p = req.path;
    return (p.includes(".js") || p.includes(".css") || p.includes(".woff"));
}

function msgHandler(req, res) {
//todo add stack trace, like sql error

    return JSON.stringify({
        reqError: res.req.err,
        details: res.locals,
        reqBody:{
            body:  req.body,
            params: req.params,
            query: req.query
        },
        resBody: res.body,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: res.responseTime + " ms"
    });
}

function levelHandler(req, res) {
    let level = "";
    if (res.statusCode >= 100) {
        level = "info";
    }
    if (res.statusCode >= 400) {
        level = "warn";
    }
    if (res.statusCode >= 500) {
        level = "error";
    }
    // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
    if (res.statusCode === 401 || res.statusCode === 403) {
        level = "critical";
    }
    // No one should be using the old path, so always warn for those
    if (req.path === "/v1" && level === "info") {
        level = "warn";
    }
    return level;
}

module.exports = {
    consoleLogger,
    fileLogger
}