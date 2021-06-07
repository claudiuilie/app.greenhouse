const GreenhouseController = require('./GreenhouseController');
const Alert = require('../models/Alert');

class PompController {
    static async setPomp(pompName, pompStatus) {

        const alert = new Alert();
        switch (pompName) {
            case "pomp" :
                await GreenhouseController.pomp(pompStatus);
                alert.type = 'info';
                alert.text = `Pomp ${pompStatus ? 'started' : 'stopped'}.`;
                break;
            default:
                alert.type = 'danger';
                alert.text = `Invalid pomp name ${pompName}`;

        }
        return alert.toObject();
    }
}


module.exports = PompController;