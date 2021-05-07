const fanSettings = require('../services/database/fanSettings');

async function getFabSettings() {
    let r = null;
    await fanSettings.getSettings()
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
    getFabSettings
}