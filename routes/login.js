const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper');
const authService = require('../services/authService');
const Alert = require('../models/Alert');

router.get('/', async (req, res, next) => {
    res.render('login', {
        layout: 'empty',
        info: req.session.alert
    });
});

router.post('/', async (req, res) => {

    const alert = new Alert();
    const { userName, password } = req.body;
    const hashedPassword = authHelper.getHashedPassword(password);
    const user = await authService.getUser(userName,hashedPassword);

    if (user) {
        const authToken = authHelper.generateAuthToken();
        authHelper.getAuthTokens()[authToken] = user.username;
        res.cookie('AuthToken', authToken);
        res.redirect('/');
    } else {
        alert.type = 'danger';
        alert.text =  'Invalid username or password';
        res.render('login', {
            layout: 'empty',
            info: alert.toObject()
        });
    }
});

module.exports = router;