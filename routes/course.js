var express = require('express');
var router = express.Router();
var middleware = require('./../models/middleware');
var mongoose = require('mongoose');
var dataCourse = mongoose.model('course');

router.get('/', function(req, res, next) {
  dataCourse.find({}, function(err, collection) {
    res.render('course/index', {
      datas: collection,
    });
  });
});

router.get('/create', function(req, res) {
  dataCourse.find({}, function(err, collection) {
    res.render('course/create', {datas: collection});
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
    recommended_year: req.body.recommended_year,
    description: req.body.description
  });
  res.redirect('/course');
});

router.get('/:id', function(req, res) {
  dataCourse.findById(req.params.id, function(err, collection) {
    res.json(collection);
  });
});

router.get('/edit/:id', function(req, res, next) {
  dataCourse.findById(req.params.id, function(err, collection) {
    dataCourse.find({}, function(err, courses) {
      res.render('course/edit', {
        data: collection,
        courses: courses
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
      recommended_year: req.body.recommended_year,
      description: req.body.description
    }, function(err) {
      if(err) {
        throw err;
      } else {
        res.redirect('/course');
      }
    });
  });
});

router.post('/delete/:id', function(req, res, next) {
  dataCourse.findById(req.params.id, function(err, collection) {
    collection.remove(function(err) {
      if(err) {
        throw err;
      } else {
        res.redirect('/course');
      }
    });
  });
});

module.exports = router;
