var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var middleware = require('./../models/middleware');
var crypto = require('crypto');
var dataUser = mongoose.model('user');

/* GET users listing. */
router.get('/', middleware, function(req, res, next) {
  console.log(req.user.roles[0]);
  if(req.user.roles[0] == 'admin'){
    dataUser.find({}, function(err, collection) {
      res.render('account/user', {datas: collection});
    });
  } else {
    res.redirect('/');
  }
});

router.get('/edit/:id', function(req, res) {
	dataUser.findById(req.params.id, function(err, collection) {
		res.render('account/user-edit', {data: collection});
	});
});

router.post('/edit/:id', function(req, res) {
	dataUser.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'student_email': req.body.student_email,
        'department': req.body.department,
        'username': req.body.username
      }
    },
    function(err, collection) {
      if (err){
        console.log(err);
      }
    }
  );
	res.redirect('/users');
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

function hashPwd(salt, password) {
  var hmac = crypto.createHmac('sha1', salt);
  return hmac.update(password).digest('hex');
}
