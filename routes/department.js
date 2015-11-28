var express = require('express');
var router = express.Router();

// Middlewares
var auth = require('./../middlewares/auth');

// Models
var dataDepartment = require('./../models/department');

//Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

router.get('/', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataDepartment.find({}, function(err, collection) {
    res.render('department/index', {
      datas: collection,
      successMessage: req.flash('successMessage'),
      errorMessage: req.flash('errorMessage'),
      is_admin: req.user.is_admin,
      is_instructor: req.user.is_instructor,
      username: req.user.username,
    });
  });
});

router.get('/create', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataDepartment.find({}, function(err, collection) {
    res.render('department/create', {
      datas: collection,
      is_admin: req.user.is_admin,
      is_instructor: req.user.is_instructor,
      username: req.user.username,
    });
  });
});

router.post('/create', auth, function(req, res, next) {
  dataDepartment.create({
    name: req.body.name,
    abbreviation: req.body.abbreviation,
  });
  res.redirect('/department');
});

router.get('/edit/:id', auth, function(req, res, next) {
  if (req.user.is_admin != 1) {
    res.redirect('/');
  }

  dataDepartment.findById(req.params.id, function(err, collection) {
    res.render('department/edit', {
      data: collection,
      is_admin: req.user.is_admin,
      is_instructor: req.user.is_instructor,
      username: req.user.username,
    });
  });
});

router.post('/edit/:id', auth, function(req, res) {
  dataDepartment.findById(req.params.id, function(err, collection) {
    collection.update({
      name: req.body.name,
      abbreviation: req.body.abbreviation,
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/department');
      }
    });
  });
});

router.post('/delete/:id', auth, function(req, res, next) {
  dataDepartment.findById(req.params.id, function(err, data) {
    data.remove(function(err) {
      if (err) {
        throw err;
      } else {
        res.redirect('/department');
      }
    });
  });
});

module.exports = router;
