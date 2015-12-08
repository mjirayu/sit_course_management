var express = require('express');
var router = express.Router();

// Middlewares
var auth = require('./../middlewares/auth');
var passport = require('./../middlewares/passport');

// Models
var dataPlan = require('./../models/plan');
var dataAuthUser = require('./../models/auth_user');
var dataUser = require('./../models/user_profile');
var dataDepartment = require('./../models/department');

// Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

router.get('/', auth, function(req, res) {
  if (req.user.reset_password != '') {
    res.render('account/reset_password');
	} else if (req.user.is_student == 1) {
    res.render('dnd/dnd', req.user);
  } else if (req.user.is_admin == 1 ) {
    dataUser.find().distinct('entranced_year', function(error, entracnedYears) {
      dataDepartment.find({}, function(err, collection) {
        res.render('admin/admin', {
          username: req.user.username,
          is_admin: req.user.is_admin,
          is_instructor: req.user.is_instructor,
          departments: collection,
          entracnedYears: entracnedYears,
        });
      });
    });
  } else if (req.user.is_instructor == 1) {
    res.redirect('/instructors/approve_plan');
  }

});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login', function(req, res) {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('login');
	}
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
	})
);

router.post('/reset_password', auth, function(req, res) {
  var today = dateFunction.getDate();

  if (req.body.password_confirm == req.body.password) {
    dataAuthUser.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'password': authtentication.hashPwd(req.user.salt, req.body.password),
          'reset_password': '',
          'last_update': today,
        },
      },
      function(err) {
        if (err) {
          message = validate.getMessage(err);
          res.send(message);
        }

        res.redirect('/logout');
      }
    );
  } else {
    res.redirect('/');
  }

});

module.exports = router;
