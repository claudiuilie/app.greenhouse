const cronJobManager = require('../cron/cronJobManager');
const Alert = require('../models/Alert');

class JobsController {

    static getJobs() {
        return this.getJobManager().jobs;
    }

    static getJobManager() {
        return cronJobManager.getJobManager();
    }

    static setJobState(jobName, jobState) {

        const alert = new Alert();
        if (jobState === 0) {
            this.getJobManager().start(jobName);

            alert.type = 'info';
            alert.text = `${jobName} started.`;

        } else {
            this.getJobManager().stop(jobName);

            alert.type = 'info';
            alert.text = `${jobName} stopped.`;

        }
        return alert.toObject();
    }
}

module.exports = JobsController;