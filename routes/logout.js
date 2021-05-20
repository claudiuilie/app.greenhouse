const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper');

router.get('/',  (req, res, next) => {
    const token = req.cookies.AuthToken
    delete authHelper.getAuthTokens()[token]
    res.redirect('/login');
});

module.exports = router;
