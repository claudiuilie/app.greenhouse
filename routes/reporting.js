const express = require('express');
const router = express.Router();
const mailHelper = require('../helpers/mailerHelper')
const Alert = require('../models/Alert');

router.get('/lastDay', async (req, res, next) => {

    const alert = new Alert();
    await mailHelper.sendLastDayReport()
        .then((data)=>{
            alert.type =  "success";
            alert.text = `[${data.response}] - Report sent to ${JSON.stringify(data.accepted)}`;
            req.session.alert = alert.toObject()
            res.redirect('/admin');
        })
        .catch((err)=>{
            alert.type = "danger";
            alert.text = `There was an error at email sending.`;
            req.session.alert = alert.toObject()
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