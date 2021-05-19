const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

const queryForGreenhouseEvents = `(select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, '=')+1,REGEXP_INSTR(event_request, '"}') - REGEXP_INSTR(event_request, '=')-1) "event_value",event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"
                from events
                where function_name = 'setFanIn' 
                order by event_id desc limit 5)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, '=')+1,REGEXP_INSTR(event_request, '"}') - REGEXP_INSTR(event_request, '=')-1) "event_value",event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"
                from events
                where function_name = 'setFanOut' 
                order by event_id desc limit 5)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, 'digital')+10,1) "event_value", event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date" 
                from events
                where function_name = 'setVegLamp' 
                order by event_id desc limit 4)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, 'digital')+10,1) "event_value", event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date" 
                from events
                where function_name = 'setFruitLamp' 
                order by event_id desc limit 4)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, 'digital')+10,1) "event_value", event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"  
                from events
                where function_name = 'pomp' 
                order by event_id desc limit 4)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, '&')+1,REGEXP_INSTR(event_request, '"}')-1 - REGEXP_INSTR(event_request, '&')) "event_value",event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"
                from events
                where function_name = 'setPomp' 
                order by event_id desc limit 4)`;

const queryForPompEvents = `select TIMESTAMPDIFF(MINUTE,event_date,NOW()) > 10 "can_run"
                            from events 
                            where function_name in ('pomp' ,'setPomp' ) 
                            order by event_date desc limit 1`;

async function getGreenhouseEvents() {
    let r;
    await db.query(queryForGreenhouseEvents)
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

async function getPompEvents() {
    let r;
    await db.query(queryForPompEvents)
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
    getGreenhouseEvents,
    getPompEvents
}
