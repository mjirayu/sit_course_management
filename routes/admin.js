var express = require('express');
var router = express.Router();

// Middlewares
var auth = require('./../middlewares/auth');
var passport = require('./../middlewares/passport');

// Models
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');

// Helpers
var validate = require('./../helpers/validate');

router.get('/', function(req, res, next) {
  res.render('admin/admin');
});

router.get('/login', function(req, res, next) {
  res.render('admin/login');
});

router.post('/create', function(req, res) {
  dataAuthUser.create({
    username: req.body.username,
  }, function(err) {
    if (err) {
      var message = validate.getMessage(err);
      res.send(message);
    }
  });
});

module.exports = router;
