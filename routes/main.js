const express = require('express');
const router = express.Router();
const http = require("../services/httpRequestService");
const options = require('../config/config').greenhouse;

/* GET home page. */
router.get('/',  async (req, res, next) => {


  let greenhouseScheduler = null;
  let greenhouseHistory = null;

  await http(options.scheduler)
      .then((data)=>{greenhouseScheduler = data})
      .catch((err)=>{next(err)});

  await http(options.history)
      .then((data)=>{greenhouseHistory = data})
      .catch((err)=>{next(err)})

  res.render('home', {
    scheduler: greenhouseScheduler,
    history: greenhouseHistory
  });

});

module.exports = router;
