const greenhouseScheduleDb = require('../services/database/greenhouseSchedule');

async function getActiveSchedule() {
    let r = null;
    await greenhouseScheduleDb.getActive()
        .then(async (data)=>{
            if(data.length > 0){
                r = data[0]
            }
        })
        .catch((err)=>{
             console.log(err);
        });
    return r;
}

async function getAllSchedules() {
    let r = null;
    await greenhouseScheduleDb.getMultiple()
        .then(async (data)=>{
            if(data.length > 0){
                r = data
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    return r;
}

module.exports = {
    getActiveSchedule,
    getAllSchedules
}