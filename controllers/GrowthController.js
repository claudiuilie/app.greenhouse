const growthService = require('../services/database/growthService');

class GrowthController {

    static async getActiveGrowth() {
        return  await growthService.getActiveGrowth();
    }

    static async getActiveGrowthProgress() {
        return  await growthService.getActiveGrowthProgress()
    }
}


module.exports = GrowthController;