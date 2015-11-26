var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var auth = require('./../middlewares/auth');
var dataCourse = require('./../models/course');
var dataUserProfile = require('./../models/user_profile');
var dataDepartment = require('./../models/department');

//Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

router.get('/', function(req, res, next) {
  dataCourse.find({})
    .sort('recommended_year')
    .populate('instructor')
    .populate('department')
    .exec(function(err, collection) {
      res.render('course/index', {
        datas: collection,
      });
    });
});

router.get('/create', function(req, res) {
  dataCourse.find({}, function(err, collection) {
    dataDepartment.find({}, function(err, departments) {
      dataUserProfile.find({})
        .populate('auth')
        .exec(function(err, users) {
          res.render('course/create', {
            datas: collection,
            users: users,
            departments: departments,
          });
        });
    });
  });
});

router.post('/create', function(req, res) {
  dataCourse.create({
    course_name: req.body.course_name,
    course_id: req.body.course_id,
    credit: req.body.credit,
    instructor: req.body.instructor,
    department: req.body.department,
    prerequisite: req.body.prerequisite,
    corequisite: req.body.corequisite,
    recommended_year: req.body.recommended_year,
    description: req.body.description,
    type: req.body.type,
  });
  res.redirect('/course');
});

router.get('/edit/:id', function(req, res, next) {
  dataCourse.findById(req.params.id, function(err, collection) {
    dataCourse.find({}, function(err, courses) {
      dataDepartment.find({}, function(err, departments) {
        dataUserProfile.find({})
          .populate('auth')
          .exec(function(err, users) {
            res.render('course/edit', {
              data: collection,
              courses: courses,
              users: users,
              departments: departments,
            });
          });
      });
    });
  });
});

router.post('/edit/:id', function(req, res) {
  dataCourse.findById(req.params.id, function(err, collection) {
    collection.update({
      course_name: req.body.course_name,
      course_id: req.body.course_id,
      credit: req.body.credit,
      instructor: req.body.instructor,
      department: req.body.department,
      prerequisite: req.body.prerequisite,
      corequisite: req.body.corequisite,
      recommended_year: req.body.recommended_year,
      description: req.body.description,
      type: req.body.type,
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/course');
      }
    });
  });
});

router.post('/delete/:id', function(req, res, next) {
  dataCourse.findById(req.params.id, function(err, data) {
    data.remove(function(err) {
      if (err) {
        throw err;
      } else {
        res.redirect('/course');
      }
    });
  });
});

module.exports = router;
