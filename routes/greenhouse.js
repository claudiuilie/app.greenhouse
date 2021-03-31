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
  let greenhouseTempHistory = {data: [],labels: []};
  let greenhouseHumHistory = {data: [],labels: []};
  let greenhouseSoilHistory = {data: [],labels: []};
  res.body = {sensors: null,greenhouseScheduler: null,greenhouseHistory: null};

  await http(options.greenhouse.sensors)
      .then((data)=>{
        res.body.sensors = data;
        greenhouseStatus = data;
      })
      .catch((err)=>{next(err)})

  await greenhouseHistoryDb.getMultiple(24)
      .then((data)=>{
        greenhouseHistory = data.data;
        res.body.greenhouseHistory = greenhouseHistory;
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
      })
      .catch((err)=>{next(err)});

  await greenhouseScheduleDb.getMultiple()
      .then((data)=>{
        greenhouseScheduler = data.data;
        res.body.greenhouseScheduler = greenhouseScheduler;
      })
      .catch((err)=>{
        next(err);
      })

  res.render('home', {
    scheduler: greenhouseScheduler,
    history: greenhouseHistory,
    status: greenhouseStatus,
    tempHistory: greenhouseTempHistory,
    humHistory: greenhouseHumHistory,
    soilHistory: greenhouseSoilHistory,
    info : {type: req.query.type,text: req.query.text}
  });

});

module.exports = router;
