const mysql = require('mysql2/promise');
const config = require('../config/config');

async function insertEvent(insertObject){
        const query = `INSERT into events (event_type, function_name, event_request, event_result, event_error) VALUES(?,?,?,?,?);`;
        const connection = await mysql.createConnection(config.db);
        const [results, ] = await connection.execute(query, Object.values(insertObject));
        connection.destroy();
}

module.exports = {
    insertEvent
};

