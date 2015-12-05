var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var url = require('url');
var qs = require('querystring');

var auth = require('./../middlewares/auth');
var dataCourse = require('./../models/course');
var dataUserProfile = require('./../models/user_profile');
var dataDepartment = require('./../models/department');

//Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');
var pagination = require('./../helpers/pagination');

router.get('/', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  var perPage = 10;
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var params = qs.parse(url.parse(req.url).query);

  res.locals.createPagination = function(pages, page) {
    return pagination.createPagination(pages, page, params);
  };

  dataCourse.find({})
    .sort('recommended_year')
    .populate('instructor')
    .populate('department')
    .skip(perPage * page)
    .limit(perPage)
    .exec(function(err, collection) {

      dataCourse.find({}).count().exec(function(err, count) {
        dataDepartment.find({}, function(err, departments) {
          res.render('course/index', {
            datas: collection,
            departments: departments,
            page: page,
            pages: count / perPage,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            is_admin: req.user.is_admin,
            is_instructor: req.user.is_instructor,
            username: req.user.username,
          });
        });
      });
    });
});

router.get('/create', auth, function(req, res) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataCourse.find({}, function(err, collection) {
    dataDepartment.find({}, function(err, departments) {
      dataUserProfile.find({})
        .populate('auth')
        .exec(function(err, users) {
          res.render('course/create', {
            datas: collection,
            users: users,
            departments: departments,
            is_admin: req.user.is_admin,
            is_instructor: req.user.is_instructor,
            username: req.user.username,
          });
        });
    });
  });
});

router.post('/create', auth, function(req, res) {
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

router.get('/edit/:id', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

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
              is_admin: req.user.is_admin,
              is_instructor: req.user.is_instructor,
              username: req.user.username,
            });
          });
      });
    });
  });
});

router.post('/edit/:id', auth, function(req, res) {
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

router.post('/delete/:id', auth, function(req, res, next) {
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

router.get('/search', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  var perPage = 10;
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var paramsPage = qs.parse(url.parse(req.url).query);

  var params = req.query;
  var course_id = new RegExp(params.course_id, 'i');
  var course_name = new RegExp(params.course_name, 'i');
  var fullname = new RegExp(params.fullname, 'i');

  res.locals.createPagination = function(pages, page) {
    return pagination.createPagination(pages, page, paramsPage);
  };

  dataCourse
    .find({
      course_id: { $regex: course_id },
      course_name: { $regex: course_name },
      department: params.department,
    })
    .populate('instructor', null, {fullname: { $regex: fullname }})
    .populate('department')
    .skip(perPage * page)
    .limit(perPage)
    .exec(function(err, collection) {

      if (err) res.send(err);
      datas = collection.filter(function(item) {
        if (item.department == null) return false;
        if (item.instructor == null) return false;
        return true;
      })
      .map(function(item) {
        return item;
      });

      dataCourse.find({
        course_id: { $regex: course_id },
        course_name: { $regex: course_name },
        department: params.department,
      }).count().exec(function(err, count) {
        dataDepartment.find({}, function(err, departments) {
          res.render('course/index', {
            datas: datas,
            departments: departments,
            departmentSearch: params.department,
            courseID: params.course_id,
            courseName: params.course_name,
            fullName: params.fullname,
            page: page,
            pages: count / perPage,
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            is_admin: req.user.is_admin,
            is_instructor: req.user.is_instructor,
            username: req.user.username,
          });
        });
      });
    });
});


module.exports = router;
