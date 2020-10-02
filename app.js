const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const newPostRouter = require('./routes/newPost');
const signupRouter = require('./routes/signup');
const signoutRouter = require('./routes/signout');
const userRouter = require('./routes/user');
const articleRouter = require('./routes/article');
const categoryRouter = require('./routes/category');

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
app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;