const http = require('http');
const eventService = require('../services/eventService');
const acceptedCallers = ['setFanIn','setFanOut','setVegLamp','setFruitLamp','setPomp','pomp','sleep'];

function httpRequest(options) {
    const callerName = arguments.callee.caller.name;
    const event = {
        event_type: "HTTP",
        function_name: callerName,
        event_request: JSON.stringify({options}),
        event_result: null,
        event_error: null
    };

    return new Promise(async (resolve, reject) => {
        await http.request(options, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {

                if (resp.statusCode !== 200) {
                    event.event_result = JSON.stringify({
                        statusCode: resp.statusCode,
                        statusMessage: resp.statusMessage
                    });
                    reject(resp.statusCode + " " + resp.statusMessage)
                } else {
                    event.event_result = data;
                    resolve(JSON.parse(data));
                }
            });

        }).on('error', (error) => {
            event.event_error = JSON.stringify(error);
            reject(error)
        }).on('close',  async ()=>{
            if (acceptedCallers.includes(callerName))
                await eventService.insertEvent(event);
        }).end();
    });
}

module.exports = httpRequest