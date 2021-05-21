const growthService = require('../services/database/growthService');

async function getActiveGrowth() {
    return  await growthService.getActiveGrowth();
}

async function getActiveGrowthProgress() {
    return  await growthService.getActiveGrowthProgress();
}

module.exports = {
    getActiveGrowth,
    getActiveGrowthProgress
}