const path = require('path');
const httpAuth = require('http-auth');
const authConnect = require("http-auth-connect");
const basicAuth = httpAuth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

module.exports = authConnect(basicAuth);