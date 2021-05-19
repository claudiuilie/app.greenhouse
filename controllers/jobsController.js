const cronJobManager = require('../cron/cronJobManager');

function getJobs() {
    return getJobManager().jobs;
}

function getJobManager() {
    return cronJobManager.getJobManager();
}

function setJobState(jobName, jobState){

    let alert;
    if (jobState === 0) {
        getJobManager().start(jobName);
        alert = {
            type: 'info',
            text: `${jobName} started.`
        };
    } else {
        getJobManager().stop(jobName);
        alert = {
            type: 'info',
            text: `${jobName} stopped.`
        };
    }
    return alert;
}

module.exports = {
    getJobs,
    setJobState,
    getJobManager
}