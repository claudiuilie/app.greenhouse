const mysql = require('mysql2/promise');
const config = require('../../config/config');
const eventService = require('../eventService');

function query(sql, params) {

    const event = {
        event_type: "DB",
        function_name: arguments.callee.caller.name,
        event_request: {sql:sql,params: params},
        event_result: null,
        event_error: null
    }

    return new Promise(async (resolve,reject)=>{
        try{
            const connection = await mysql.createConnection(config.db);
            const [results, ] = await connection.execute(sql, params);
            connection.destroy();
            event.event_result = JSON.stringify(results);
            resolve(results);
        }catch(err){
            event.event_error = JSON.stringify(err);
            reject(err)
        }

        await logEvent(event);
    });
}

async function logEvent(event) {

    if(typeof insertEvent !== undefined){
        try{
            await eventService.insertEvent(event);
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = {
    query
}