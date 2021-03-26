const express = require('express');
const router = express.Router();
const http = require('../../services/httpRequestService');
const options = require("../../config/config").greenhouse.sensors;

/* GET programming languages. */
router.get('/', async function(req, res, next) {

    res.body = {1:2}
    console.log(res.body)
    await http(options)
            .then((data)=>{
                res.body = data;
                res.json(data)
            })
            .catch((err)=>{next(err)})

});

module.exports = router;