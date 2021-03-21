const http = require('http');

function httpRequest(options){
    return new Promise((resolve,reject)=>{
        http.request(options, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {

                if(resp.statusCode !== 200){
                    reject(resp.statusCode +" "+ resp.statusMessage)
                }else{
                    resolve(JSON.parse(data));
                }
            });

        }).on('error', (error)=>{reject(error)}).end();
    })
}

module.exports = httpRequest