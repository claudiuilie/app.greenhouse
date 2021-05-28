const CronJobManager = require('cron-job-manager');
const scheduleService = require('../services/database/scheduleService')
const historyService = require('../services/database/greenhouseHistoryService')
const fanService = require('../services/database/fanSettingsService')
const greenhouseController = require('../controllers/greenhouseController');
const soilMoistureHelper = require('../helpers/soilMoistureHelper');
const eventService = require('../services/database/eventsDbService');
const mailerHelper = require('../helpers/mailerHelper');
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

    greenhouseJobManager.add("mailer", process.env.MAILER_DAILY_REPORT_JOB_INTERVAL, () => {
        mailerHelper.sendLastDayReport().catch((err)=>{
            console.log(err)
        });
    }, {
        start: process.env.MAILER_DAILY_REPORT_JOB_AUTOSTART,
        onComplete: () => {
            console.log("MAILER stopped")
        }
    });

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
    const schedule = await scheduleService.getActiveSchedule();
    const greenHouseStats = await greenhouseController.getStats();

    if (schedule && greenHouseStats) {
        const tempInRange = isInRange(greenHouseStats.temperature, schedule.min_temp, schedule.max_temp);
        const humInRange = isInRange(greenHouseStats.humidity, schedule.min_humidity, schedule.max_humidity);
        const moistInRange1 = isInRange(greenHouseStats.soil_moisture_1, schedule.wet, schedule.dry);
        const moistInRange2 = isInRange(greenHouseStats.soil_moisture_2, schedule.wet, schedule.dry);

        await tempControl(tempInRange, schedule, greenHouseStats)
        await lightsControl(schedule, greenHouseStats);
        await pompControl(moistInRange1,moistInRange2,greenHouseStats.soil_moisture_1, greenHouseStats.soil_moisture_2, schedule);
    }

}

async function pompControl(moistInRange1,moistInRange2,sensor1, sensor2, schedule) {

    const minMoist = schedule.min_moist;
    const ml = schedule.water_ml;
    if(moistInRange1 && moistInRange2){
        const pompOff = await eventService.getPompEvents();
        const s1Percent =  soilMoistureHelper.moisturePercent(sensor1, schedule.dry, schedule.wet);
        const s2Percent =  soilMoistureHelper.moisturePercent(sensor2, schedule.dry, schedule.wet)
        if(s1Percent < minMoist && s2Percent < minMoist && typeof pompOff.can_run == "number" ? pompOff.can_run : 0){
            await greenhouseController.setPomp(ml);
        }
    }
}

async function tempControl(inRange, schedule, greenHouseStats) {

    const fanSettings = await fanService.getSettings();

    if (inRange) {
        switch (schedule.max_temp - greenHouseStats.temperature) {
            case 0 :
                await setFans(fanSettings.max * 0.8, fanSettings.max * 0.8, greenHouseStats);
                break;
            case 1 :
                await setFans(fanSettings.max * 0.6, fanSettings.max * 0.8, greenHouseStats);
                break;
            case 2 :
                await setFans(fanSettings.max * 0.4, fanSettings.max * 0.6, greenHouseStats);
                break;
            case 3 :
                await setFans(fanSettings.max * 0.4, fanSettings.max * 0.4, greenHouseStats);
                break;
            default :
                await setFans(fanSettings.max * 0.3, fanSettings.max * 0.3, greenHouseStats);
                break;
        }
    } else if (greenHouseStats.temperature > schedule.max_temp) {
        await setFans(fanSettings.max, fanSettings.max, greenHouseStats);
    } else {
        await setFans(fanSettings.min, fanSettings.min, greenHouseStats);
    }
}

async function lightsControl(schedule, greenHouseStats) {
    switch (schedule.name) {
        case "SEED":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await setLights(true,false, greenHouseStats);
            } else {
                await setLights(false,false, greenHouseStats);
            }
            break;
        case "VEG":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await setLights(true,false, greenHouseStats);
            } else {
                await setLights(false,false, greenHouseStats);
            }
            break;
        case "FLOWER":
            if (checkHours(schedule.lamp_start, schedule.lamp_stop)) {
                await setLights(true,true, greenHouseStats);
            } else {
                await setLights(false,false, greenHouseStats);
            }
            break;
        default:
            console.log(`Invalid stage name ${schedule.name}`)
    }
}

async function setFans(fanInSettings,fanOutSettings, greenHouseStats){
    try{
        if(greenHouseStats.fan_in !== fanInSettings)
            await greenhouseController.setFanIn(fanInSettings);

        if(greenHouseStats.fan_out !== fanOutSettings)
            await greenhouseController.setFanOut(fanOutSettings);
    }catch(err){
        console.log(err)
    }
}

async function setLights(startVegLamp, startFruitLamp, greenhouseStats){
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

function getJobManager() {
    return greenhouseJobManager;
}

module.exports = {
    createJobs,
    getJobManager
};