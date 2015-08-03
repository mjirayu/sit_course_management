var express = require('express');
var passport = require('passport');
var session = require('express-session');
var logger = require('morgan');
var bodyParser = require('body-parser');
var stylus = require('stylus');

module.exports = function(app, config) {
  function compile(str, path) {
    return stylus(str).set('filename', path);
  }

  app.set('views', config.rootPath + '/server/views');
  app.set('view engine', 'jade');
  app.use(logger('tiny'));
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'multi vision unicorns',
    cookie: { maxAge: 60000 },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(stylus.middleware(
    {
      src: config.rootPath + '/public',
      compile: compile,
    }
  ));
  app.use(express.static(config.rootPath + '/public'));
};
