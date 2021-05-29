const mysql = require('mysql2/promise');
const config = require('../../config/config');
const eventService = require('../eventService');
const Event = require('../../models/Event');
const acceptedCallers = ['insertHistory'];

function query(sql, params) {

    const callerName = arguments.callee.caller.name
    const event = new Event("BD");
    event.function_name = callerName;
    event.event_request = {sql: sql, params: params};

    return new Promise(async (resolve, reject) => {
        try {
            const connection = await mysql.createConnection(config.db);
            const [results,] = await connection.execute(sql, params);
            connection.destroy();
            event.event_result = JSON.stringify(results);
            resolve(results);
        } catch (err) {
            event.event_error = JSON.stringify(err);
            reject(err)
        }

        if (acceptedCallers.includes(callerName))
            await logEvent(event.toObject());
    });
}

async function logEvent(e) {
    if (typeof e !== undefined) {
        try {
            await eventService.insertEvent(e);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = {
    query
}