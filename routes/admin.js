const express = require('express');
const router = express.Router();
const fs = require('fs');
const readline = require("readline");
const path = require('path');
const cronJobManager = require('../cron/cronJobManager');

/* GET home page. */
router.get('/', (req, res, next) => {
    let l = [];
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
                    jobs: cronJobManager.getJobManager().jobs
                })
        });

});

router.post('/cron/stop', (req, res, next) => {
    console.log('stop')
    res.redirect('/admin');
});
router.post('/cron/start', (req, res, next) => {
    console.log("________________")
    console.log(req.query)
    console.log("________________")
    console.log(req.params)
    console.log("________________")
    console.log(req.body)
    res.redirect('/admin');
});

module.exports = router;
