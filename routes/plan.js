var express = require('express');
var router = express.Router();
var middleware = require('./../models/middleware');
var mongoose = require('mongoose');
var dataplan = mongoose.model('plan');
var path = require('path');

router.get('/', middleware, function(req, res, next) {
	res.redirect('/');
});

router.get('/:id', middleware, function(req, res) {
	dataplan.findById(req.params.id, function(err,collection) {
		res.sendfile(path.resolve('public/app.html'));
	});
});

router.get('/api/:id', middleware, function(req, res, next) {
	dataplan.findById(req.params.id, function(err,collection) {
		res.json(collection);
	});
});

module.exports = router;
