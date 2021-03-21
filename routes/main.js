const express = require('express');
const router = express.Router();
const http = require("../services/httpRequestService");
const options = require('../config/config').greenhouse;

/* GET home page. */
router.get('/',  async (req, res, next) => {

  let greenhouseScheduler = null;
  let greenhouseHistory = null;
  let greenhouseStatus = null;

  await http(options.scheduler)
      .then((data)=>{greenhouseScheduler = data})
      .catch((err)=>{next(err)});

  await http(options.history)
      .then((data)=>{greenhouseHistory = data})
      .catch((err)=>{next(err)})

  await http(options.sensors)
      .then((data)=>{greenhouseStatus = data})
      .catch((err)=>{next(err); req.err = err})

  res.render('home', {
    scheduler: greenhouseScheduler,
    history: greenhouseHistory,
    status: greenhouseStatus
  });

});

module.exports = router;
