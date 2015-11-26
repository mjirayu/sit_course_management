var express = require('express');
var router = express.Router();

var auth = require('./../middlewares/auth');
var dataPlan = require('./../models/plan');
var dataCourse = require('./../models/course');

router.get('/', function(req, res, next) {
  dataPlan.find({})
		.populate('department')
		.exec(function(err, collection) {
  		res.render('plan/plan-admin', {datas: collection});
    });
});

router.get('/:id', function(req, res) {
  res.render('./dnd/dnd');
});

module.exports = router;
