const express = require('express');
const path = require('path');
const env = require('dotenv').config()
const session = require('express-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authHelper = require('./helpers/authHelper');
const hbsHelper = require('./helpers/hbsHelper')
const loggerService = require('./services/loggerService')
const indexRouter = require('./routes/home');
const adminRouter = require('./routes/admin');
const growthRouter = require('./routes/growth')
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const reportingRouter = require('./routes/reporting');
const cronManager = require('./cron/cronJobManager');
const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbsHelper.engine);
app.set('view engine', 'hbs');
app.use(session({
  cookie: { maxAge: 10000 },
  resave: false,
  secret: process.env.APP_SECRET,
  saveUninitialized: false
}));

// app.use(loggerService.consoleLogger);
app.use(loggerService.fileLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies['AuthToken'];
  // Inject the user to the request
  req.user = authHelper.getAuthTokens()[authToken];
  next();
});
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
// app.use((req, res, next) => {
//   // Get auth token from the cookies
//   if(!req.user){
//     res.render('login', {
//       layout: 'empty',
//       message: {
//         type: 'alert',
//         text: 'Please login to continue'
//       }
//     });
//     return;
//   }
//   next();
// });

app.use('/', indexRouter);
app.use('/admin',adminRouter);
app.use('/growth', growthRouter);
app.use('/reporting', reportingRouter);
cronManager.createJobs();

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
