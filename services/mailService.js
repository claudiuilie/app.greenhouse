const nodemailer = require('nodemailer');
const eventService = require('../services/eventService')
const Event = require('../models/Event');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_TRANSPORTER_SERVICE,
    auth: {
        user: process.env.MAIL_TRANSPORTER_SENDER,
        pass: process.env.MAIL_TRANSPORTER_PASSWORD
    }
});

function sendMail(mailOptions){

    const event = new Event("MAIL");
    event.function_name = arguments.callee.caller.name;
    event.event_request = JSON.stringify(mailOptions);

     transporter.sendMail(mailOptions)
         .then(async (data)=>{
             console.log('data', data)
             event.event_result = JSON.stringify(data);
             await eventService.insertEvent(event)
         })
         .catch(async (err)=>{
             console.log('err', err)
             event.event_error = JSON.stringify(err);
             await eventService.insertEvent(event)
         })
}

module.exports = {
    sendMail
}