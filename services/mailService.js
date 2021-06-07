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

async function sendMail(mailOptions){
    const event = new Event("MAIL");
    event.function_name = sendMail.prototype;
    event.event_request = JSON.stringify(mailOptions);
    const response  = {
        data: null,
        error: null
    }

    await transporter.sendMail(mailOptions)
         .then(async (data)=>{
             response.data = data;
             event.event_result = JSON.stringify(data);
             await eventService.insertEvent(event.toObject())
         })
         .catch(async (err)=>{
             response.error = err;
             event.event_error = JSON.stringify(err);
             await eventService.insertEvent(event.toObject())
         });

    return response;
}

module.exports = {
    sendMail
}