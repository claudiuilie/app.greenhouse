const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

async function getLasDayHistory() {
    const query = `SELECT * from history order by modified desc LIMIT 24 `;
    const rows = await db.query(query)
        .catch((err) => {
            console.log(err);
        });
    return helper.emptyOrRows(rows);
}

async function getDailyHistory(){
    const query = `SELECT temperature,
                    humidity,
                    soil_moisture_1,
                    soil_moisture_2,
                    water_level,
                    fan_in,
                    fan_out,
                    pomp_off,
                    fruit_lamp_off,
                    veg_lamp_off,
                    DATE_FORMAT(modified,"%H:%i") "hour"
                   from history 
                   where modified BETWEEN CURRENT_DATE -1 and CURRENT_DATE;`

    const rows = await db.query(query)
        .catch((err) => {
            console.log(err);
        });
    return helper.emptyOrRows(rows);
}

async function getTodayHistory(){
    const query = `SELECT temperature,
                    humidity,
                    soil_moisture_1,
                    soil_moisture_2,
                    water_level,
                    fan_in,
                    fan_out,
                    pomp_off,
                    fruit_lamp_off,
                    veg_lamp_off,
                    DATE_FORMAT(modified,"%H:%i") "hour"
                   from history 
                   where modified > CURRENT_DATE;`

    const rows = await db.query(query)
        .catch((err) => {
            console.log(err);
        });
    return helper.emptyOrRows(rows);
}

async function insertHistory(insertObject) {
    const query = `INSERT into history (temperature,humidity,soil_moisture_1,soil_moisture_2,water_level,fan_in,fan_out,pomp_off,veg_lamp_off,fruit_lamp_off, cycle_id) VALUES(?,?,?,?,?,?,?,?,?,?,(select id from cycle where active_cycle =1))`;

    const rows = await db.query(query, Object.values(insertObject))
        .catch((err) => {
            console.log(err);
        });
    return helper.emptyOrRows(rows);
}

module.exports = {
    getLasDayHistory,
    getDailyHistory,
    getTodayHistory,
    insertHistory
}