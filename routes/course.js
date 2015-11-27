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

      dataDepartment.find({}, function(err, departments) {
        res.render('course/index', {
          datas: collection,
          departments: departments,
          successMessage: req.flash('successMessage'),
          errorMessage: req.flash('errorMessage'),
        });
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

router.get('/search', function(req, res, next) {
  var params = req.query;
  var course_id = new RegExp(params.course_id, 'i');
  var course_name = new RegExp(params.course_name, 'i');
  var fullname = new RegExp(params.fullname, 'i');
  var department = new RegExp(params.department, 'i');

  dataCourse
    .find({
      course_id: { $regex: course_id },
      course_name: { $regex: course_name },
    })
    .populate('instructor', null, {fullname: { $regex: fullname }})
    .populate('department', null, {abbreviation: { $regex: department }})
    .exec(function(err, collection) {
      console.log(collection);

      if (err) res.send(err);
      datas = collection.filter(function(item) {
        if (item.department == null) return false;
        if (item.instructor == null) return false;
        return true;
      })
      .map(function(item) {
        return item;
      });

      dataDepartment.find({}, function(err, departments) {
        res.render('course/index', {
          datas: datas,
          departments: departments,
          departmentSearch: params.department,
          courseID: params.course_id,
          courseName: params.course_name,
          fullName: params.fullname,
          successMessage: req.flash('successMessage'),
          errorMessage: req.flash('errorMessage'),
        });
      });
    });
});


module.exports = router;
