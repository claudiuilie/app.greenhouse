const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

const query = `(select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, '=')+1,REGEXP_INSTR(event_request, '"}') - REGEXP_INSTR(event_request, '=')-1) "event_value",event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"
                from events
                where function_name = 'setFanIn' 
                order by event_id desc limit 2)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, '=')+1,REGEXP_INSTR(event_request, '"}') - REGEXP_INSTR(event_request, '=')-1) "event_value",event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"
                from events
                where function_name = 'setFanOut' 
                order by event_id desc limit 2)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, 'digital')+10,1) "event_value", event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date" 
                from events
                where function_name = 'setVegLamp' 
                order by event_id desc limit 2)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, 'digital')+10,1) "event_value", event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date" 
                from events
                where function_name = 'setFruitLamp' 
                order by event_id desc limit 2)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, 'digital')+10,1) "event_value", event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"  
                from events
                where function_name = 'pomp' 
                order by event_id desc limit 2)
                union all 
                (select function_name,SUBSTRING(event_request,REGEXP_INSTR(event_request, '&')+1,REGEXP_INSTR(event_request, '"}')-1 - REGEXP_INSTR(event_request, '&')) "event_value",event_result,event_error,DATE_FORMAT(event_date, "%d/%m/%Y %H:%i:%S") "event_date"
                from events
                where function_name = 'setPomp' 
                order by event_id desc limit 2)`;

async function getGreenhouseEvents() {
    let r;
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
    getGreenhouseEvents,
}
