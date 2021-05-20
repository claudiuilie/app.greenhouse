const crypto = require('crypto');
const authToken = {};

function getAuthTokens() {
    return authToken;
}
function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex');
}

function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}

module.exports = {
    generateAuthToken,
    getHashedPassword,
    getAuthTokens
}