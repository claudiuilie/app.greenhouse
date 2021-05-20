const db = require('./database/mysqlService');
const helper = require('../helpers/dbHelper');

function getUser(username, password) {
    const credQuery = `Select * from users where username = ? and password = ?;`
    return new Promise(async (resolve, reject) => {
        try {
            const rows = await db.query(credQuery, [username, password]);
            const data = helper.emptyOrRows(rows);
            resolve(data[0]);
        } catch (err) {
            reject(err)
        }
    });
}

module.exports = {
    getUser
}