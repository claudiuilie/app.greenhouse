const GreenhouseController = require('./GreenhouseController');
const Alert = require('../models/Alert');

class LightsController {
    static async setLights(lightName, lightStatus) {

        const alert = new Alert();
        switch (lightName) {
            case "vegPhase" :
                await GreenhouseController.setVegLamp(!lightStatus);
                alert.type = 'info';
                alert.text = `Veg lights ${!lightStatus ? 'started' : 'stopped'}.`;
                break;
            case "fruitPhase" :
                await GreenhouseController.setFruitLamp(!lightStatus);
                alert.type = 'info';
                alert.text = `Flower lights ${!lightStatus ? 'started' : 'stopped'}.`;
                break;
            default:
                alert.type = 'danger';
                alert.text = `Invalid light name ${lightName}`;

        }
        return alert.toObject();
    }
}

module.exports = LightsController;