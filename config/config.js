const env = process.env;

const config = {
    db: { /* don't expose password or any sensitive info, done only for demo */
        host     : process.env.DB_HOST ,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD ,
        database : process.env.DB_DATABASE
    },
    greenhouse: {
        sensors: {
            host: process.env.GREENHOUSE_HOST,
            method: process.env.GREENHOUSE_METHOD
        },
        vegLight: {
            hostname: process.env.GREENHOUSE_HOST,
            method: "GET",
            path:  "/vegPhase"
        }

    },
    listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;
