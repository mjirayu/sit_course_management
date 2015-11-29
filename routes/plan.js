var express = require('express');
var router = express.Router();

var auth = require('./../middlewares/auth');
var dataPlan = require('./../models/plan');
var dataCourse = require('./../models/course');

router.get('/', auth, function(req, res, next) {
  dataPlan.find({})
		.populate('department')
		.exec(function(err, collection) {
  		res.render('plan/plan-admin', {
        datas: collection,
        is_admin: req.user.is_admin,
        is_instructor: req.user.is_instructor,
        username: req.user.username,
      });
    });
});

router.get('/:id', auth, function(req, res) {
  res.render('./dnd/dnd', req.user);
});

module.exports = router;
