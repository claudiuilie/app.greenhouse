const express = require('express');
const exphbs = require('express-handlebars');
require('dotenv').config()
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const authService = require('./services/authService');
const loggerService = require('./services/loggerService')
const indexRouter = require('./routes/main');
const greenhouseSchedulerRouter = require('./routes/api/greenhouseSchedule');
const greenhouseHistoryRouter = require('./routes/api/greenhouseHistory');
const greenhouseRouter = require('./routes/api/greenhouse');
const adminRouter = require('./routes/admin');
const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  // Specify helpers which are only registered on this instance.
  helpers: {
    ifEquals: function (arg1, arg2, options) {  return (arg1 === arg2) ? options.fn(this) : options.inverse(this); }
  }
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.use(loggerService.consoleLogger);
app.use(loggerService.fileLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authService);

app.use('/', indexRouter);
app.use('/server/greenhouse-scheduler', greenhouseSchedulerRouter);
app.use('/server/greenhouse-history', greenhouseHistoryRouter);
app.use('/server/greenhouse', greenhouseRouter);
app.use('/admin',adminRouter);
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ message: err });
});

module.exports = app;
