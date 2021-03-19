const express = require('express');
const router = express.Router();
const http = require('../../services/httpRequestService');
const options = require("../../config/config").greenhouse.sensors;

/* GET programming languages. */
router.get('/', async function(req, res, next) {

    await http(options)
            .then((data)=>{res.json(data)})
            .catch((err)=>{next(err)})

});

module.exports = router;