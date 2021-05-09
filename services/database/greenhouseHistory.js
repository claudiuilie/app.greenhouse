const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

function getMultiple(){
    return new Promise(async (resolve,reject)=>{
        try{
            const rows = await db.query(
                `SELECT * from history order by modified desc LIMIT 24 `
            );
            const data = helper.emptyOrRows(rows);
            resolve(data);
        }catch(err){
            reject(err)
        }
    });
}

function insertHistory(insertObject){
    return new Promise(async (resolve,reject)=>{
        const query = `INSERT into history (temperature,humidity,soil_moisture_1,soil_moisture_2,fan_in,fan_out,pomp_off,veg_lamp_off,fruit_lamp_off) VALUES(?,?,?,?,?,?,?,?,?)`;
        try{
            const rows = await db.query(
                query,
                Object.values(insertObject)
            );
            const data = helper.emptyOrRows(rows);

            resolve({
                data
            });
        }catch(err){
            reject(err)
        }
    });
}

module.exports = {
    getMultiple,
    insertHistory
}