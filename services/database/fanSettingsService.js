const db = require('./mysqlService');
const helper = require('../../helpers/dbHelper');

async function getSettings() {
    let r;
    const query = `SELECT * from fan_settings ;`
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
    getSettings
}