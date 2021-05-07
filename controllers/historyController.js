const greenhouseHistory = require('../services/database/greenhouseHistory');

async function getLastDayHistory() {
    let r = null;
    await greenhouseHistory.getMultiple()
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

async function insertIntoHistory(insertValues) {
    await greenhouseHistory.insertHistory(insertValues)
        .catch((err)=>{
            return err;
        });
}


module.exports = {
    getLastDayHistory,
    insertIntoHistory
}
