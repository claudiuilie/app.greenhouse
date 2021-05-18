const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

async function getActiveGrowth() {
    let r;
    const query = `select c.id "cycle_id",
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
    await db.query(query)
        .then(async (data) => {
            if (data.length > 0) {
                r = data
            }
        })
        .catch((err) => {
            console.log(err);
        });
    return helper.emptyOrRows(r);

}

module.exports = {
    getActiveGrowth
}