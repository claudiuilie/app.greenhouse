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


function getActiveGrowth() {
    return new Promise(async (resolve, reject) => {
        try {
            const rows = await db.query(
                `select 
                            g.cycle_id,
                            g.active "active_growth",
                            g.\`date\` "growth_start_date",
                            c.schedule_id,
                            c.active "active_cycle",
                            c.start_date,
                            c.end_date,
                            s.lamp_start,
                            s.lamp_stop,
                            s.min_temp,
                            s.max_temp,
                            s.min_humidity,
                            s.max_humidity,
                            s.stage_id,
                            s.active "active_schedule"
                            from growth g 
                          left join cycle c on c.id = g.cycle_id
                          left join schedule s on c.schedule_id = s.id
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
    getTankSettings
}