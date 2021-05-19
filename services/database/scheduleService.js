const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

async function getActiveSchedule() {
    let r;
    const query = `select s.*,ss.name,so.dry, so.wet from cycle c 
                join schedule s on s.id = schedule_id
                join stage ss on ss.id = s.stage_id
                left join soil_moisture so on so.id = 1
                where c.active_cycle = 1;`

    await db.query(query)
        .then(async (data) => {
            if (data.length > 0) {
                r = data[0]
            }
        })
        .catch((err) => {
            console.log(err);
        });
    return helper.emptyOrRows(r);
}

module.exports = {
    getActiveSchedule,
}