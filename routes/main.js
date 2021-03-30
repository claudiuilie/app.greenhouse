const express = require('express');
const router = express.Router();
const http = require("../services/httpRequestService");
const greenhouseHistoryDb = require('../services/database/greenhouseHistory');
const greenhouseScheduleDb = require('../services/database/greenhouseSchedule');
const options = require('../config/config');

/* GET home page. */
router.get('/',  async (req, res, next) => {

  let greenhouseScheduler = null;
  let greenhouseHistory = null;
  let greenhouseStatus = null;
  let greenhouseTempHistory = {
    data: [],
    labels: []
  }
  let greenhouseHumHistory = {
    data: [],
    labels: []
  }
  let greenhouseSoilHistory = {
    data: [],
    labels: []
  }

  await http(options.greenhouse.sensors)
      .then((data)=>{
        res.body = data;
        greenhouseStatus = data;
      })
      .catch((err)=>{next(err)})

  try {
    let data = await greenhouseHistoryDb.getMultiple(10)
    res.body = data;
    greenhouseHistory = data.data;
  } catch (err) {
    next(err);
  }

  try {
    let data = await greenhouseScheduleDb.getMultiple()
    res.body = data;
    console.log(data)
    greenhouseScheduler = data.data;
  } catch (err) {
    next(err);
  }

  if(greenhouseHistory != null){
    for(let k = greenhouseHistory.length -1 ; k >= 0 ; k--){
      if(greenhouseHistory[k].temperature != null){
        greenhouseTempHistory.data.push(greenhouseHistory[k].temperature);
        greenhouseTempHistory.labels.push(1);
        greenhouseHumHistory.data.push(greenhouseHistory[k].humidity);
        greenhouseHumHistory.labels.push(1);
        greenhouseSoilHistory.data.push(greenhouseHistory[k].soil_moisture);
        greenhouseSoilHistory.labels.push(1);
      }
    }
  }

  res.render('home', {
    scheduler: greenhouseScheduler,
    history: greenhouseHistory,
    status: greenhouseStatus,
    tempHistory: greenhouseTempHistory,
    humHistory: greenhouseHumHistory,
    soilHistory: greenhouseSoilHistory
  });

});

module.exports = router;
