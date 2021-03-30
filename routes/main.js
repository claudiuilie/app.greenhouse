const express = require('express');
const router = express.Router();
const http = require("../services/httpRequestService");
const options = require('../config/config').greenhouse;

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

  await http(options.scheduler)
      .then((data)=>{greenhouseScheduler = data.data})
      .catch((err)=>{next(err)});

  await http(options.history)
      .then((data)=>{greenhouseHistory = data.data})
      .catch((err)=>{next(err)})

  await http(options.sensors)
      .then((data)=>{greenhouseStatus = data})
      .catch((err)=>{next(err); req.err = err})

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
