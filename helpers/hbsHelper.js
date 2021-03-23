const expressHbs = require('express-handlebars');

const hbs = expressHbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        ifEquals: function (arg1, arg2, options) {  return (arg1 === arg2) ? options.fn(this) : options.inverse(this); }
    }
});

module.exports = hbs;