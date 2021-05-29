const greenhouseController = require('./GreenhouseController');
const Alert = require('../models/Alert');

async function setLights(lightName, lightStatus) {

    const alert = new Alert();
    switch (lightName) {
        case "vegPhase" :
            await greenhouseController.setVegLamp(!lightStatus);
            alert.type = 'info';
            alert.text = `Veg lights ${!lightStatus ? 'started' : 'stopped'}.`;
            break;
        case "fruitPhase" :
            await greenhouseController.setFruitLamp(!lightStatus);
            alert.type = 'info';
            alert.text = `Flower lights ${!lightStatus ? 'started' : 'stopped'}.`;
            break;
        default:
            alert.type = 'danger';
            alert.text = `Invalid light name ${lightName}`;

    }
    return alert.toObject();
}

module.exports = {
    setLights
}