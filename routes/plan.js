var express = require('express');
var router = express.Router();
var path = require('path');

var auth = require('./../middlewares/auth');
var dataPlan = require('./../models/plan');
var dataCourse = require('./../models/course');


router.get('/', auth, function(req, res, next) {
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

router.get('/edit/:id', auth, function(req, res) {
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

router.post('/edit/:id', auth, function(req, res) {
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

router.get('/:id', auth, function(req, res) {
	dataCourse.find({}, function(err, collection) {
		console.log(collection);
		res.render('course-dnd',{plan:collection});
		//res.sendfile(path.resolve('public/app.html'));
	});
});

// router.get('/api/:id', middleware, function(req, res, next) {
// 	dataplan.findById(req.params.id, function(err,collection) {
// 		res.json(collection);
// 	});
// });

module.exports = router;
