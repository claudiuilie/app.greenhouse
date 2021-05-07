const CronJobManager = require('cron-job-manager');
const scheduleController = require('../controllers/scheduleController');
const greenhouseController = require('../controllers/greenhouseController');
const historyController = require('../controllers/historyController');
const fanSettingsController = require('../controllers/fanSettingsController');
const DateAndTime = require('../helpers/dateAndTipeHelper');
let greenhouseJobManager;

function createJobs() {
    greenhouseJobManager = new CronJobManager(process.env.GREENHOUSE_HISTORY_JOB_LABEL, process.env.GREENHOUSE_HISTORY_JOB_ITERVAL, () => {
            historyJob().catch((err) => {
                console.log(err)
            });
        },
        {
            start: false,
            onComplete: () => {
                console.log("GREENHOUSE_HISTORY_JOB stopped")
            }
        });

    greenhouseJobManager.add(process.env.GREENHOUSE_MONITOR_JOB_LABEL, process.env.GREENHOUSE_MONITOR_JOB_INTERVAL, () => {
        monitorJob().catch((err) => {
            console.log(err)
        });

    }, {
        start: false,
        onComplete: () => {
            console.log("GREENHOUSE_MONITOR_JOB stopped")
        }
    });

}

function getJobManager() {
    return greenhouseJobManager;
}

async function historyJob() {

    const insertValues = {
        temperature: null,
        humidity: null,
        soil_moisture: null,
        fan_in: null,
        fan_out: null,
        pomp_off: null,
        veg_lamp_off: null,
        fruit_lamp_off: null
    }

    let gStats = await greenhouseController.getStats();

    if (gStats) {
        insertValues.temperature = gStats.temperature;
        insertValues.humidity = gStats.humidity;
        insertValues.soil_moisture = gStats.soil_moisture;
        insertValues.fan_in = gStats.fan_in;
        insertValues.fan_out = gStats.fan_out;
        insertValues.pomp_off = gStats.pomp_off;
        insertValues.veg_lamp_off = gStats.veg_lamp_off;
        insertValues.fruit_lamp_off = gStats.fruit_lamp_off;
    }

    await historyController.insertIntoHistory(insertValues)
}

async function monitorJob() {

    let schedule = await scheduleController.getActiveSchedule();
    let greenHouseStats = await greenhouseController.getStats();

    if (schedule && greenHouseStats) {


        let tempInRange = isInRange(greenHouseStats.temperature, schedule.min_temp, schedule.max_temp);
        let humInRange = isInRange(greenHouseStats.humidity, schedule.min_humidity, schedule.max_humidity);
        //todo hum control

        await tempControl(tempInRange, schedule, greenHouseStats)
        await lightsControl(schedule);

    }

}

async function tempControl(inRange, schedule, greenHouseStats) {

    const fanSettings = await fanSettingsController.getFabSettings();

    if (inRange) {
        switch (schedule.max_temp - greenHouseStats.temperature) {
            case 0 :
                await greenhouseController.setFanIn(fanSettings.max * 0.8);
                await greenhouseController.setFanOut(fanSettings.max * 0.8);
                break;
            case 1 :
                await greenhouseController.setFanIn(fanSettings.max * 0.6);
                await greenhouseController.setFanOut(fanSettings.max * 0.8);
                break;
            case 2 :
                await greenhouseController.setFanIn(fanSettings.max * 0.4);
                await greenhouseController.setFanOut(fanSettings.max * 0.6);
                break;
            case 3 :
                await greenhouseController.setFanIn(fanSettings.max * 0.4);
                await greenhouseController.setFanOut(fanSettings.max * 0.4);
                break;
            default :
                await greenhouseController.setFanIn(fanSettings.max * 0.3);
                await greenhouseController.setFanOut(fanSettings.max * 0.3);
                break;
        }
    } else if (greenHouseStats.temperature > schedule.max_temp) {
        await greenhouseController.setFanIn(fanSettings.max);
        await greenhouseController.setFanOut(fanSettings.max);
    } else {
        await greenhouseController.setFanIn(fanSettings.min);
        await greenhouseController.setFanOut(fanSettings.min + 1);
    }
}

async function lightsControl(schedule) {
    switch (schedule.name) {
        case "SEED":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await greenhouseController.setVegLamp(true);
                await greenhouseController.setFruitLamp(false);
            } else {
                await greenhouseController.setVegLamp(false);
                await greenhouseController.setFruitLamp(false);
            }
            break;
        case "VEG":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await greenhouseController.setVegLamp(true);
                await greenhouseController.setFruitLamp(false);
            } else {
                await greenhouseController.setVegLamp(false);
                await greenhouseController.setFruitLamp(false);
            }
            break;
        case "FLOWER":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await greenhouseController.setVegLamp(true);
                await greenhouseController.setFruitLamp(true);
            } else {
                await greenhouseController.setFruitLamp(false);
                await greenhouseController.setVegLamp(false);
            }
            break;
        default:
            console.log(`Invalid stage name ${schedule.name()}`)
    }
}

function isInRange(val, min, max) {
    return val >= min && val <= max;
}

function checkHours(startHour, stopHour) {
    let date = new DateAndTime();
    let hours = date.getHours();

    if (hours < startHour || hours >= stopHour) {
        return false;
    } else if (hours === stopHour) {
        return false
    } else if (hours >= startHour && hours < stopHour) {
        return true;
    }
}


module.exports = {
    createJobs,
    getJobManager
};