const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');
const config = require('../../config/config');

async function getMultiple(page = 1){
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * from greenhouse_monitor LIMIT ?,?`,
        [offset, config.listPerPage]
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    return {
        data,
        meta
    }
}


module.exports = {
    getMultiple
}