const greenhouseController = require('../controllers/greenhouseController');

async function setFan(fanName, fanStatus) {
    let alert;
    switch (fanName) {
        case "fanIn" :
            await greenhouseController.setFanIn(fanStatus ? 102 : 0);
            alert = {
                type: 'info',
                text: `Fan in ${fanStatus ? 'started' : 'stopped'}.`
            }
            break;
        case "fanOut" :
            await greenhouseController.setFanOut(fanStatus ? 102 : 0);
            alert = {
                type: 'info',
                text: `Fan out ${fanStatus ? 'started' : 'stopped'}.`
            }
            break;
        default:
            alert = {
                type: 'danger',
                text: `Invalid fan name ${fanName}`
            }
    }
    return alert;
}

module.exports = {
    setFan
}