const readline = require("readline");
const fs = require('fs');
const path = require('path');

async function getLogs() {
    const l = [];
    await readline.createInterface({
        input: fs.createReadStream(path.join(process.env.LOGS_FILE)),
        terminal: false
    })
        .on('line', (line) => {
            let log = JSON.parse(line);
            typeof log.message == 'string' ? log.message = JSON.parse(log.message) : null;
            l.push(JSON.parse(line))
        })
        .on('error', (err) => {
            console.log(err)
        })
    return l;
}

module.exports = {
    getLogs
}