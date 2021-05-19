const greenhouseController = require('../controllers/greenhouseController');

async function setPomp(pompName, pompStatus) {
    let alert;
    switch (pompName) {
        case "pomp" :
            await greenhouseController.pomp(pompStatus);
            alert = {
                type: 'info',
                text: `Pomp ${pompStatus ? 'started' : 'stopped'}.`
            }
            break;
        default:
            alert = {
                type: 'danger',
                text: `Invalid pomp name ${pompName}`
            }
    }
    return alert;
}

module.exports = {
    setPomp
}