const mysql = require('mysql2/promise');
const config = require('../../config/config');
const eventService = require('../eventService');
const acceptedCallers = ['insertHistory'];

function query(sql, params) {

    const callerName = arguments.callee.caller.name;
    const event = {
        event_type: "DB",
        function_name: callerName,
        event_request: {sql: sql, params: params},
        event_result: null,
        event_error: null
    }

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
            await logEvent(event);
    });
}

async function logEvent(event) {
    console.log(event)
    if (typeof event !== undefined) {
        try {
            await eventService.insertEvent(event);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = {
    query
}