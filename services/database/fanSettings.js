const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

function getSettings(){
    return new Promise(async (resolve,reject)=>{
        try{
            const rows = await db.query(
                `SELECT * from fan_settings ;`
            );
            const data = helper.emptyOrRows(rows);
            resolve(data);
        }catch(err){
            reject(err)
        }
    });
}

module.exports = {
    getSettings
}