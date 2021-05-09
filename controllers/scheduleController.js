const greenhouseScheduleDb = require('../services/database/greenhouseGrowth');

async function getAllActiveGrowth() {
    let r = null;
    await greenhouseScheduleDb.getActiveGrowth()
        .then(async (data)=>{
            if(data.length > 0){
                r = data[0];
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    return r;
}

async function getActiveSchedule() {
    let r = null;
    await greenhouseScheduleDb.getActiveSchedule()
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

async function getTankSettings() {
    let r = null;
    await greenhouseScheduleDb.getTankSettings()
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

module.exports = {
    getAllActiveGrowth,
    getActiveSchedule,
    getTankSettings
}