const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');
const config = require('../../config/config');

function getActiveSchedule(){
    return new Promise(async (resolve,reject)=>{
        const query = `SELECT s.*,ss.name FROM schedule s 
                            LEFT JOIN stage ss on s.stage_id = ss.id 
                        WHERE s.active = 1;`
        try{
            const rows = await db.query(query);
            const data = helper.emptyOrRows(rows);

            resolve(data);
        }catch(err){
            reject(err)
        }
    });
}

function getTankSettings(){
    return new Promise(async (resolve,reject)=>{
        const query = `SELECT * from water_tank;`
        try{
            const rows = await db.query(query);
            const data = helper.emptyOrRows(rows);

            resolve(data);
        }catch(err){
            reject(err)
        }
    });
}

function getSoilSettings(){
    return new Promise(async (resolve,reject)=>{
        const query = `SELECT * from soil_moisture;`
        try{
            const rows = await db.query(query);
            const data = helper.emptyOrRows(rows);

            resolve(data);
        }catch(err){
            reject(err)
        }
    });
}

function getActiveGrowth() {
    return new Promise(async (resolve, reject) => {
        try {
            const rows = await db.query(
                `select c.id "cycle_id",
                        c.growth_id,
                        c.schedule_id,
                        c.active_cycle,
                        c.start_date "start_date_format",
                        c.end_date "end_date_format",
                        DATE_FORMAT(c.start_date, "%d/%m/%Y") "start_date",
                        DATE_FORMAT(c.end_date, "%d/%m/%Y") "end_date",s.*
                     from growth g 
                        join cycle c on c.growth_id = g.id
                        join schedule s on c.schedule_id = s.id
                     where g.active = 1;`
            );
            const data = helper.emptyOrRows(rows);
            resolve(data);
        } catch (err) {
            reject(err)
        }
    });
}

module.exports = {

    getActiveGrowth,
    getActiveSchedule,
    getTankSettings,
    getSoilSettings
}