const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');
const config = require('../../config/config');

function getMultiple(page = 1){
    return new Promise(async (resolve,reject)=>{
        try{
            const offset = helper.getOffset(page, config.listPerPage);
            const rows = await db.query(
                `SELECT * from greenhouse_monitor LIMIT ?,?`,
                [offset, config.listPerPage]
            );
            const data = helper.emptyOrRows(rows);
            const meta = {page};

            resolve({
                data,
                meta
            });
        }catch(err){
            reject(err)
        }
    });
}


module.exports = {
    getMultiple
}