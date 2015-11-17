var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('./middlewares/passport');
var methodOverride = require('method-override');
var flash = require('connect-flash');

var routes = require('./routes/index');
var admin = require('./routes/admin');
var students = require('./routes/students');
var instructors = require('./routes/instructors');
var course = require('./routes/course');
var plan = require('./routes/plan');
var api = require('./routes/api');
var years = require('./routes/year_semester');
var defaultplan = require('./routes/defaultplan');
//var yearSemester = require('./routes/year_semester');

var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/sit_modify');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(session({
  secret: 'anything', proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', routes);
app.use('/students', students);
app.use('/instructors', instructors);
app.use('/admin', admin);
app.use('/course', course);
app.use('/api', api);
app.use('/plan', plan);
app.use('/years',years);
app.use('/defaultplan',defaultplan);
// app.use('/year_semester', yearSemester);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
