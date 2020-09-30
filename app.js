var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var newPostRouter = require('./routes/newPost');
var signupRouter = require('./routes/signup');
var signoutRouter = require('./routes/signout');
var userRouter = require('./routes/user');
var articleRouter = require('./routes/article');
var categoryRouter = require('./routes/category');

// view engine setup
app.set('views', path.join(__dirname, 'source'));
app.set('view engine', 'pug');

app.use(session({
  cookie: {
    maxAge: 3600000
  },
  secret: 'woot',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', loginRouter);
app.use('/', newPostRouter);
app.use('/', signupRouter);
app.use('/', signoutRouter);
app.use('/', userRouter);
app.use('/', articleRouter);
app.use('/index/', categoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;