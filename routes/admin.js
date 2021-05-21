const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const jobsController = require('../controllers/jobsController');

/* GET admin page. */
router.get('/', async (req, res, next) => {
    res.render('admin',
        {
            logs: await adminController.getLogs(),
            jobs: await jobsController.getJobs(),
            admin: true,
            info: req.session.alert
        });
    req.session.alert = {};
});

router.post('/jobs', async (req, res, next) => {
    const jobName = req.body.jobName;
    const jobState = parseInt(req.body.jobState);
    req.session.alert = await jobsController.setJobState(jobName,jobState);
    res.redirect('/admin');
});

module.exports = router;
