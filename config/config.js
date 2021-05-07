const env = process.env;

const config = {
    db: { /* don't expose password or any sensitive info, done only for demo */
        host     : process.env.DB_HOST ,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD ,
        database : process.env.DB_DATABASE
    },
    greenhouse: {
        host: process.env.GREENHOUSE_HOST,
        vegLightEndpoint: process.env.GREENHOUSE_VEG_LAMP_ENDPOINT,
        fruitLightEndpoint:  process.env.GREENHOUSE_FRUIT_LAMP_ENDPOINT,
        fanInEndpoint: process.env.GREENHOUSE_FAN_IN_ENDPOINT,
        fanOutEndpoint: process.env.GREENHOUSE_FAN_OUT_ENDPOINT,
        pompEndpoint: process.env.GREENHOUSE_POMP_ENDPOINT,
        sleepEndpoint: process.env.GREENHOUSE_SLEEP_ENDPOINT
    },
    listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;
