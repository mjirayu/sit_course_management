var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var auth = require('./../middlewares/auth');
var passport = require('./../middlewares/passport');

var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');

router.get('/', function(req, res, next) {
  res.render('admin/admin');
});

router.get('/login', function(req, res, next) {
  res.render('admin/login');
});

module.exports = router;

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, password) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(password).digest('hex');
}
