const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

async function getActiveGrowth() {
    let r;
    const query = `select c.id "cycle_id",
                        c.growth_id,
                        c.schedule_id,
                        c.active_cycle,
                        CASE
                         WHEN c.end_date is null THEN DATEDIFF( CURRENT_DATE(),c.start_date)
                         ELSE  DATEDIFF( c.end_date,c.start_date)
                        END as "cycle_progress",
                        DATE_FORMAT(c.start_date, "%d/%m/%Y") "start_date",
                        DATE_FORMAT(c.end_date, "%d/%m/%Y") "end_date",s.*
                     from growth g 
                        join cycle c on c.growth_id = g.id
                        join schedule s on c.schedule_id = s.id
                     where g.active = 1`
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

async function getActiveGrowthProgress() {
    let r;
    const query = ` select SUM(
                       CASE
                        WHEN c.end_date is null THEN DATEDIFF( CURRENT_DATE(),c.start_date)
                        ELSE  DATEDIFF( c.end_date,c.start_date)
                        END) as "days"
                    from growth g 
                    join cycle c on c.growth_id = g.id
                    where g.active = 1;`
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
    getActiveGrowth,
    getActiveGrowthProgress
}