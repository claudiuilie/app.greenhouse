const HttpRequestService = require("../services/httpRequestService");
const options = require('../config/config').greenhouse;
const tankService = require('../services/database/tankSettingsService')
let success;

class GreenhouseController {
    static async setFanIn(value) {
        HttpRequestService.http.prototype = this.setFanIn.name
        await HttpRequestService.http(`http://${options.host}${options.fanInEndpoint}?p=${value}`)
            .then((data) => {
                if (typeof data.return_value !== "undefined")
                    success = data.return_value === 1;
            })
            .catch((err) => {
                console.log(err);
                success = false
            })

        return success;
    }

    static async setFanOut(value) {
        HttpRequestService.http.prototype = this.setFanOut.name
        await HttpRequestService.http(`http://${options.host}${options.fanOutEndpoint}?p=${value}`)
            .then((data) => {
                if (typeof data.return_value !== "undefined")
                    success = data.return_value === 1;
            })
            .catch((err) => {
                console.log(err);
                success = false
            })
        return success;
    }

    static async setVegLamp(value) {
        HttpRequestService.http.prototype = this.setVegLamp.name
        await HttpRequestService.http(`http://${options.host}/digital/5/${value ? 0 : 1}`)
            .then((data) => {
                if (typeof data !== "undefined")
                    success = true;
            })
            .catch((err) => {
                console.log(err);
                success = false
            })
        return success;
    }

    static async setFruitLamp(value) {
        HttpRequestService.http.prototype = this.setFruitLamp.name;
        await HttpRequestService.http(`http://${options.host}/digital/6/${value ? 0 : 1}`)
            .then((data) => {
                if (typeof data !== "undefined")
                    success = true;
            })
            .catch((err) => {
                console.log(err);
                success = false
            })
        return success;
    }

    static async setPomp(ml) {
        HttpRequestService.http.prototype = this.setPomp.name;
        const tank = await tankService.getTankSettings();
        if (tank.length > 0) {

            const runSeconds = parseInt(ml / parseFloat(tank.ml_s) / 2);
            const sleepSeconds = 2;

            await HttpRequestService.http(`http://${options.host}${options.pompEndpoint}?p=1&${runSeconds}:${sleepSeconds}`)
                .then((data) => {
                    if (typeof data.return_value !== "undefined")
                        success = data.return_value === 1;
                })
                .catch((err) => {
                    console.log(err);
                    success = false
                })

        } else {
            success = false;
        }
        return success;
    }

    static async pomp(start) {
        HttpRequestService.http.prototype = this.pomp.name;
        await HttpRequestService.http(`http://${options.host}/digital/3/${start ? 0 : 1}`)
            .then((data) => {
                if (typeof data.return_value !== "undefined")
                    success = data.return_value === 1;
            })
            .catch((err) => {
                console.log(err);
                success = false
            })
        return success;
    }

    static async sleep() {
        HttpRequestService.http.prototype = this.sleep.name;
        await HttpRequestService.http(`http://${options.host}${options.sleepEndpoint}?p=1`)
            .then((data) => {
                if (typeof data.return_value !== "undefined")
                    success = data.return_value === 1;
            })
            .catch((err) => {
                console.log(err);
                success = false
            })
        return success;
    }

    static async getStats() {
        let stats = null;

        HttpRequestService.http.prototype = this.getStats.name;
        await HttpRequestService.http(`http://${options.host}`)
            .then((data) => {
                if (typeof data.variables !== "undefined")
                    stats = data.variables;
            })
            .catch((err) => {
                console.log(err);
            })
        return stats;
    }
}

module.exports = GreenhouseController;