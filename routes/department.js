var express = require('express');
var router = express.Router();

// Models
var dataDepartment = require('./../models/department');

//Helpers
var dateFunction = require('./../helpers/date');
var authtentication = require('./../helpers/auth');
var validate = require('./../helpers/validate');

router.get('/', function(req, res, next) {
  dataDepartment.find({}, function(err, collection) {
    res.render('department/index', {
      datas: collection,
      successMessage: req.flash('successMessage'),
      errorMessage: req.flash('errorMessage'),
    });
  });
});

router.get('/create', function(req, res, next) {
  dataDepartment.find({}, function(err, collection) {
    res.render('department/create', {
      datas: collection,
    });
  });
});

router.post('/create', function(req, res, next) {
  dataDepartment.create({
    name: req.body.name,
    abbreviation: req.body.abbreviation,
  });
  res.redirect('/department');
});

router.get('/edit/:id', function(req, res, next) {
  dataDepartment.findById(req.params.id, function(err, collection) {
    res.render('department/edit', {
      data: collection,
    });
  });
});

router.post('/edit/:id', function(req, res) {
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

router.post('/delete/:id', function(req, res, next) {
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
