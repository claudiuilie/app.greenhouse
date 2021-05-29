const greenhouseController = require('./GreenhouseController');
const Alert = require('../models/Alert');

async function setFan(fanName, fanStatus) {

    const alert = new Alert();
    switch (fanName) {
        case "fanIn" :
            await greenhouseController.setFanIn(fanStatus ? 102 : 0);
            alert.type = 'info'
            alert.text = `Fan in ${fanStatus ? 'started' : 'stopped'}.`;
            break;
        case "fanOut" :
            await greenhouseController.setFanOut(fanStatus ? 102 : 0);
            alert.type = 'info';
            alert.text = `Fan out ${fanStatus ? 'started' : 'stopped'}.`;
            break;
        default:
            alert.type = 'danger';
            alert.text = `Invalid fan name ${fanName}`;

    }
    return alert.toObject();
}

module.exports = {
    setFan
}