const express = require('express');
const router = express.Router();
const mailHelper = require('../helpers/mailerHelper')
const Alert = require('../models/Alert');

router.get('/lastDay', async (req, res, next) => {


    const data = await mailHelper.sendLastDayReport();
    const alert = new Alert();

    if(data.error){
        alert.type = "danger";
        alert.text = `There was an error at email sending - ${data.error.response}`;
    }else{
        alert.type =  "success";
        alert.text = `${data.data.response} - Report sent to ${JSON.stringify(data.data.accepted)}`;
    }
    req.session.alert = alert.toObject();
    res.redirect('/admin');

});

router.get('/today', async (req, res, next) => {

    const data = await mailHelper.sendTodayReport();
    const alert = new Alert();

    if(data.error){
        alert.type = "danger";
        alert.text = `There was an error at email sending - ${data.error.response}`;
    }else{
        alert.type =  "success";
        alert.text = `${data.data.response} - Report sent to ${JSON.stringify(data.data.accepted)}`;
    }
    req.session.alert = alert.toObject();
    res.redirect('/admin');

});

module.exports = router;