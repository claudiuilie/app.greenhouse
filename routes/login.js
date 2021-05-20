const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper');
const authService = require('../services/authService');

router.get('/', async (req, res, next) => {
    res.render('login', {
        alert: req.session.alert
    });
});


router.post('/', async (req, res) => {

    const { userName, password } = req.body;
    const hashedPassword = authHelper.getHashedPassword(password);
    const user = await authService.getUser(userName,hashedPassword);

    if (user) {
        const authToken = authHelper.generateAuthToken();
        authHelper.getAuthTokens()[authToken] = user.username;
        res.cookie('AuthToken', authToken);
        res.redirect('/');
    } else {
        res.render('login', {
            info: {
                text: 'Invalid username or password',
                type: "danger"
            }
        });
    }
});

module.exports = router;