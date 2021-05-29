const greenhouseController = require('./GreenhouseController');
const Alert = require('../models/Alert');

async function setPomp(pompName, pompStatus) {

    const alert = new Alert();
    switch (pompName) {
        case "pomp" :
            await greenhouseController.pomp(pompStatus);
            alert.type = 'info';
            alert.text = `Pomp ${pompStatus ? 'started' : 'stopped'}.`;
            break;
        default:
            alert.type = 'danger';
            alert.text = `Invalid pomp name ${pompName}`;

    }
    return alert.toObject();
}

module.exports = {
    setPomp
}