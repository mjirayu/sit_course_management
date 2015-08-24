var express = require('express');
var router = express.Router();
var middleware = require('./../models/middleware');
var mongoose = require('mongoose');
var dataPlan = mongoose.model('plan');
var path = require('path');

router.get('/', middleware, function(req, res, next) {
	if (req.user.roles[0] == 'admin') {
		dataPlan.find({'status': 'pending'}, function(err, collection) {
			res.render('plan/plan-admin', {
				datas: collection,
			});
		});
	} else {
		res.redirect('/');
	}
});

router.get('/edit/:id', middleware, function(req, res) {
	if (req.user.roles[0] == 'admin') {
		dataPlan.findById(req.params.id, function(err, collection) {
			res.render('plan/plan-edit', {
				data: collection,
			});
		});
	} else {
		res.redirect('/');
	}
});

router.post('/edit/:id', middleware, function(req, res) {
	if (req.user.roles[0] == 'admin') {
		dataPlan.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					'status': req.body.status,
					'message': req.body.message
				}
			},
			function(err, collection) {
				if (err) {
					console.log(err);
				}
			}
		);
	}
	res.redirect('/plan');
});

router.get('/:id', middleware, function(req, res) {
	dataPlan.findById(req.params.id, function(err, collection) {
		res.sendfile(path.resolve('public/app.html'));
	});
});

// router.get('/api/:id', middleware, function(req, res, next) {
// 	dataplan.findById(req.params.id, function(err,collection) {
// 		res.json(collection);
// 	});
// });

module.exports = router;
