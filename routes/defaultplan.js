var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var auth = require('./../middlewares/auth');

// Model
var dataCourse = require('./../models/course');
var dataUserProfile = require('./../models/user_profile');
var dataPlan = require('./../models/plan');
var dataDepartment = require('./../models/department');

router.get('/create', function(req, res, next) {
  dataDepartment.find({}, function(err, departments) {
    res.render('defaultplan/plan', {
      departments: departments,
    });
  });
});

router.get('/:id', function(req, res, next) {
  dataPlan.findById(req.params.id)
    .populate('department')
    .exec(function(err, data) {
      if (err)
        res.redirect('/plan');
      res.render('defaultplan/edit');
    });
});

module.exports = router;
