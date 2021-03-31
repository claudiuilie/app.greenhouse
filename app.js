const express = require('express');
const path = require('path');
const env = require('dotenv').config()
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const authService = require('./services/authService');
const hbsHelper = require('./helpers/hbsHelper')
const loggerService = require('./services/loggerService')
const indexRouter = require('./routes/greenhouse');
const adminRouter = require('./routes/admin');
const cronManager = require('./cron/cronJobManager');
const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbsHelper.engine);
app.set('view engine', 'hbs');
// app.use(loggerService.consoleLogger);
app.use(loggerService.fileLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authService);

app.use('/', indexRouter);
app.use('/admin',adminRouter);
// catch 404 and forward to error handler

cronManager.createJobs();

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
