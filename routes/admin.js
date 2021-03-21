const express = require('express');
const router = express.Router();
const fs = require('fs');
const readline = require("readline");

/* GET home page. */
router.get('/',   (req, res, next) => {

    let l = [];
    readline.createInterface({
        input: fs.createReadStream(process.env.LOGS_FILE),
        terminal: false
    })
        .on('line', (line)=>{
            let log = JSON.parse(line);
            typeof log.message == 'string' ? log.message = JSON.parse(log.message) : null;
            l.push(JSON.parse(line))
        })
        .on('error', (err)=> {next(err)})
        .on('close', ()=>{res.render('admin',{logs:l})});

});

module.exports = router;
