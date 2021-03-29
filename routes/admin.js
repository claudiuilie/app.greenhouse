const express = require('express');
const router = express.Router();
const fs = require('fs');
const readline = require("readline");
const path = require('path');
const querystring = require('querystring');
const cronJobManager = require('../cron/cronJobManager');

/* GET home page. */
router.get('/', (req, res, next) => {
    let l = [];
    let message = {
        type: req.query.type,
        text: req.query.text
    }

    readline.createInterface({
        input: fs.createReadStream(path.join(process.env.LOGS_FILE)),
        terminal: false
    })
        .on('line', (line) => {
            let log = JSON.parse(line);
            typeof log.message == 'string' ? log.message = JSON.parse(log.message) : null;
            l.push(JSON.parse(line))
        })
        .on('error', (err) => {
            next(err)
        })
        .on('close', () => {
            res.render('admin',
                {
                    logs: l,
                    jobs: cronJobManager.getJobManager().jobs,
                    info: message
                })
        });

});

router.post('/jobs', (req, res, next) => {

    let query;
    let jobName = req.body.jobName;
    let jobState = parseInt(req.body.jobState);
    let jobManager = cronJobManager.getJobManager();
    if( jobState === 0){
       jobManager.start(jobName);
       query = querystring.stringify({
            type: 'success',
            text: `${jobName} started.`
        });
    }else{
        jobManager.stop(jobName);
        query = querystring.stringify({
            type: 'success',
            text: `${jobName} stopped.`
        });
    }

    res.redirect('/admin?'+query);
});

module.exports = router;
