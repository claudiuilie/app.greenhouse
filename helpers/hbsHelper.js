const expressHbs = require('express-handlebars');

const hbs = expressHbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        ifEquals: function (arg1, arg2, options) {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
            },
        ifGreater: function (arg1, arg2, options) {
            return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
        },
        dateToString: function(dateString){

            if(typeof dateString !== 'undefined') {
                let d = new Date(dateString);
                let s = addDigit(d.getSeconds());
                let m = addDigit(d.getMinutes());
                let h = addDigit(d.getHours());
                let dd = addDigit(d.getDate());
                let mm = addDigit(d.getMonth()+1);
                let yyyy = d.getFullYear();

                return `${dd}-${mm}-${yyyy} ${h}:${m}:${s}`;
            }else{
                return null;
            }

        },
        percent: function(actual, max) {
            return (parseInt(actual / max * 100));
        }
    }
});

function addDigit(i) {
    let d = i.toString();
    return d.length === 1 ? `0${d}` : d;
}

module.exports = hbs;