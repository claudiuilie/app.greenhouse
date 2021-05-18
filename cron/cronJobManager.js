const CronJobManager = require('cron-job-manager');
const scheduleService = require('../services/database/scheduleService')
const historyService = require('../services/database/greenhouseHistoryService')
const fanService = require('../services/database/fanSettingsService')
const greenhouseController = require('../controllers/greenhouseController');
const DateAndTime = require('../helpers/dateAndTimeHelper');
let greenhouseJobManager;

function createJobs() {
    greenhouseJobManager = new CronJobManager(process.env.GREENHOUSE_HISTORY_JOB_LABEL, process.env.GREENHOUSE_HISTORY_JOB_ITERVAL, () => {
            historyJob().catch((err) => {
                console.log(err)
            });
        },
        {
            start: !!parseInt(process.env.GREENHOUSE_HISTORY_JOB_AUTOSTART),
            onComplete: () => {
                console.log("GREENHOUSE_HISTORY_JOB stopped")
            }
        });

    greenhouseJobManager.add(process.env.GREENHOUSE_MONITOR_JOB_LABEL, process.env.GREENHOUSE_MONITOR_JOB_INTERVAL, () => {
        monitorJob().catch((err) => {
            console.log(err)
        });

    }, {
        start: !!parseInt(process.env.GREENHOUSE_MONITOR_JOB_AUTOSTART),
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
        soil_moisture_1: null,
        soil_moisture_2: null,
        water_level: null,
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
        insertValues.soil_moisture_1 = gStats.soil_moisture_1;
        insertValues.soil_moisture_2 = gStats.soil_moisture_2;
        insertValues.water_level = gStats.water_level;
        insertValues.fan_in = gStats.fan_in;
        insertValues.fan_out = gStats.fan_out;
        insertValues.pomp_off = gStats.pomp_off;
        insertValues.veg_lamp_off = gStats.veg_lamp_off;
        insertValues.fruit_lamp_off = gStats.fruit_lamp_off;
    }

    await historyService.insertHistory(insertValues);
}

async function monitorJob() {
    let schedule = await scheduleService.getActiveSchedule();
    let greenHouseStats = await greenhouseController.getStats();

    if (schedule && greenHouseStats) {


        let tempInRange = isInRange(greenHouseStats.temperature, schedule.min_temp, schedule.max_temp);
        let humInRange = isInRange(greenHouseStats.humidity, schedule.min_humidity, schedule.max_humidity);
        //todo hum control
        //todo soil moisture control
        await tempControl(tempInRange, schedule, greenHouseStats)
        await lightsControl(schedule, greenHouseStats);

    }

}

async function tempControl(inRange, schedule, greenHouseStats) {

    const fanSettings = await fanService.getSettings();

    if (inRange) {
        switch (schedule.max_temp - greenHouseStats.temperature) {
            case 0 :
                await controlFans(fanSettings.max * 0.8, fanSettings.max * 0.8, greenHouseStats);
                break;
            case 1 :
                await controlFans(fanSettings.max * 0.6, fanSettings.max * 0.8, greenHouseStats);
                break;
            case 2 :
                await controlFans(fanSettings.max * 0.4, fanSettings.max * 0.6, greenHouseStats);
                break;
            case 3 :
                await controlFans(fanSettings.max * 0.4, fanSettings.max * 0.4, greenHouseStats);
                break;
            default :
                await controlFans(fanSettings.max * 0.3, fanSettings.max * 0.3, greenHouseStats);
                break;
        }
    } else if (greenHouseStats.temperature > schedule.max_temp) {
        await controlFans(fanSettings.max, fanSettings.max, greenHouseStats);
    } else {
        await controlFans(fanSettings.min, fanSettings.min, greenHouseStats);
    }
}

async function lightsControl(schedule, greenHouseStats) {
    switch (schedule.name) {
        case "SEED":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await controlLights(true,false, greenHouseStats);
            } else {
                await controlLights(false,false, greenHouseStats);
            }
            break;
        case "VEG":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await controlLights(true,false, greenHouseStats);
            } else {
                await controlLights(false,false, greenHouseStats);
            }
            break;
        case "FLOWER":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await controlLights(true,true, greenHouseStats);
            } else {
                await controlLights(false,false, greenHouseStats);
            }
            break;
        default:
            console.log(`Invalid stage name ${schedule.name}`)
    }
}

async function controlFans(fanInSettings,fanOutSettings, greenHouseStats){
    try{
        if(greenHouseStats.fan_in !== fanInSettings)
            await greenhouseController.setFanIn(fanInSettings);

        if(greenHouseStats.fan_out !== fanOutSettings)
            await greenhouseController.setFanOut(fanOutSettings);
    }catch(err){
        console.log(err)
    }
}

async function controlLights(startVegLamp, startFruitLamp, greenhouseStats){
    try{
        if(greenhouseStats.veg_lamp_off === startVegLamp)
            await greenhouseController.setVegLamp(startVegLamp);

        if(greenhouseStats.fruit_lamp_off === startFruitLamp)
            await greenhouseController.setFruitLamp(startFruitLamp);
    }catch(err){
        console.log(err)
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