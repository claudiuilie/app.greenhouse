const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const JobsController = require('../controllers/JobsController');

/* GET admin page. */
router.get('/', async (req, res, next) => {
    res.render('admin',
        {
            logs: await AdminController.getLogs(),
            jobs: await JobsController.getJobs(),
            admin: true,
            info: req.session.alert
        });
    req.session.alert = {};
});

router.post('/jobs', async (req, res, next) => {
    const jobName = req.body.jobName;
    const jobState = parseInt(req.body.jobState);
    req.session.alert = await JobsController.setJobState(jobName,jobState);
    res.redirect('/admin');
});

module.exports = router;
