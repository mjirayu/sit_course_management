var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var dataUser = mongoose.model('user');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res) {
  res.render('account/signup');
});

router.post('/signup', function(req, res) {
  salt = createSalt();
  today = new Date();
  date = today.getDate();
  month = today.getMonth()+1;
  year = today.getFullYear();
  today = month+'/'+date+'/'+year;
  if (req.body.password == req.body.confirm_password) {
    dataUser.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      department: req.body.department,
      student_email: req.body.email,
      username: req.body.username,
      salt: salt,
      password: hashPwd(salt, req.body.password),
      roles: [],
      entranced_year: req.body.entranced_year,
      last_update: today
    });
  } else {
    res.redirect('/users/signup');
  }
  res.redirect('/users');
});

module.exports = router;

function createSalt() {
  return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(pwd).digest('hex');
}
