const path = require('path');
const auth = require('http-auth');
const basicAuth = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

module.exports = basicAuth;