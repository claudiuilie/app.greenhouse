const CronJobManager = require('cron-job-manager');

let greenhouseJobManager;

function createJobs(){
    greenhouseJobManager = new CronJobManager(process.env.GREENHOUSE_HISTORY_JOB_LABEL,process.env.GREENHOUSE_MONITOR_JOB_INTERVAL,()=>{
            // console.log("GREENHOUSE_HISTORY_JOB")
        },
        {
            start:false,
            onComplete: ()=>{console.log("GREENHOUSE_HISTORY_JOB stopped")}
        });

    greenhouseJobManager.add(process.env.GREENHOUSE_MONITOR_JOB_LABEL,process.env.GREENHOUSE_MONITOR_JOB_INTERVAL, ()=>{
        // console.log("GREENHOUSE_MONITOR_JOB")
    },{
        start: true,
        onComplete: ()=>{console.log("GREENHOUSE_HISTORY_JOB stopped")}
    });

}

function getJobManager() {
    return greenhouseJobManager;
}

module.exports = {
    createJobs,
    getJobManager
};