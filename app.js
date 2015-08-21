var express = require('express');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('./models/db')();
var passport = require('./models/auth');
var middleware = require('./models/middleware');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var plan = require('./routes/plan');
var course = require('./routes/course');
var api = require('./routes/api');
var methodOverride = require('method-override');

var app = express();

app.set('domain', '55.55.55.55');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'anything' ,proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use('/', routes);
app.use('/users', users);
app.use('/plan', plan);
app.use('/api', api);
app.use('/course', course);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(3000, function() {
  console.log('Node runing on port 3000');
});

module.exports = app;
