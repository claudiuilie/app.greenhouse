const http = require('http');
const eventService = require('../services/eventService');
const Event = require('../models/Event');
const acceptedCallers = ['setFanIn', 'setFanOut', 'setVegLamp', 'setFruitLamp', 'setPomp', 'pomp', 'sleep'];

class HttpRequestService {

    static http(options) {

        const callerName = this.http.prototype;
        const event = new Event("HTTP");
        event.function_name = callerName;
        event.event_request = JSON.stringify({options});

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
            }).on('close', async () => {
                if (acceptedCallers.includes(callerName))
                    await eventService.insertEvent(event.toObject());
            }).end();
        });
    }
}



module.exports = HttpRequestService