const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');
const config = require('../../config/config');

function getMultiple(){
    return new Promise(async (resolve,reject)=>{
        try{
            const rows = await db.query(
                `select a.*,c.active "cycle_active",c.start_date,c.end_date from schedule a 
                        left join cycle c on c.stage_id = a.stage_id;`
            );
            const data = helper.emptyOrRows(rows);
            resolve(data);
        }catch(err){
            reject(err)
        }
    });
}

function getActive(){
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

module.exports = {
    getMultiple,
    getActive
}