var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var auth = require('./../middlewares/auth');
var dataCourse = require('./../models/course');
var dataUserProfile = require('./../models/user_profile');
var dataPlan = require('./../models/plan');

router.get('/create', function(req, res, next) {


      res.render('defaultplan/plan');

});

router.get('/:id', function(req, res, next) {


      res.render('defaultplan/plan');

});

module.exports = router;
