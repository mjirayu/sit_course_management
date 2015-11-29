var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var auth = require('./../middlewares/auth');

// Model
var dataCourse = require('./../models/course');
var dataUserProfile = require('./../models/user_profile');
var dataPlan = require('./../models/plan');
var dataDepartment = require('./../models/department');

router.get('/create', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataDepartment.find({}, function(err, departments) {
    res.render('defaultplan/plan', {
      departments: departments,
      is_admin: req.user.is_admin,
      is_instructor: req.user.is_instructor,
      username: req.user.username,
    });
  });
});

router.get('/:id', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataPlan.findById(req.params.id)
    .populate('department')
    .exec(function(err, data) {
      if (err)
        res.redirect('/plan');
      res.render('defaultplan/edit', req.user);
    });
});

module.exports = router;
