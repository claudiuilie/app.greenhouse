const express = require('express');
const router = express.Router();
const basicAuth = require("../services/authService");

/* GET home page. */
router.get('/', basicAuth.check((req, res, next) => {
  res.render('index', { title: 'Express' });
}));

module.exports = router;
