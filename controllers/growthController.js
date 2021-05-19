const growthService = require('../services/database/growthService');

async function getActiveGrowth() {
    return  await growthService.getActiveGrowth();
}

module.exports = {
    getActiveGrowth
}