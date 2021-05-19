const greenhouseController = require('../controllers/greenhouseController');

async function setLights(lightName, lightStatus) {
    let alert;
    switch (lightName) {
        case "vegPhase" :
            await greenhouseController.setVegLamp(!lightStatus);
            alert = {
                type: 'info',
                text: `Veg lights ${!lightStatus ? 'started' : 'stopped'}.`
            }
            break;
        case "fruitPhase" :
            await greenhouseController.setFruitLamp(!lightStatus);
            alert = {
                type: 'info',
                text: `Flower lights ${!lightStatus ? 'started' : 'stopped'}.`
            }
            break;
        default:
            alert = {
                type: 'danger',
                text: `Invalid light name ${lightName}`
            }
    }
    return alert;
}

module.exports = {
    setLights
}