const express = require('express');
const router = express.Router();
const mailHelper = require('../helpers/mailerHelper')

router.get('/lastDay', async (req, res, next) => {

    await mailHelper.sendLastDayReport()
        .then((data)=>{
            req.session.alert = {
                type : "success",
                message: `[${data.response}] - Report sent to ${JSON.stringify(data.accepted)}`
            }
            console.log(req.session.alert)
            res.redirect('/admin');
        })
        .catch((err)=>{
            req.session.alert = {
                type : "danger",
                message: `There was an error at email sending.`
            }
            res.redirect('/admin');
        })

    req.session.alert = {
        type : "success",
        message: `Report sent`
    }
});

router.get('/today', async (req, res, next) => {

    await mailHelper.sendTodayReport()
        .then((data)=>{
            req.session.alert = {
                type : "success",
                message: `[${data.response}] - Report sent to ${JSON.stringify(data.accepted)}`
            }
            console.log(req.session.alert)
            res.redirect('/admin');
        })
        .catch((err)=>{
            req.session.alert = {
                type : "danger",
                message: `There was an error at email sending.`
            }
            res.redirect('/admin');
        })

});

module.exports = router;