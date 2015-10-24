var express = require('express');
var router = express.Router();

var auth = require('./../middlewares/auth');
var dataPlan = require('./../models/plan');
var dataUser = require('./../models/user_profile');

router.get('/', auth, function(req, res, next) {
	res.redirect('/');
});

router.get('/:id', auth, function(req, res, next) {
	dataUser.findOne({_id:req.params.id}, function(err, collection) {
		//res.render('plan-list',{user:req.user,datas:collection});
		res.json(collection);
	});
});

router.get('/plan/:id', function(req, res, next) {
	dataPlan.findById(req.params.id, function(err,collection) {
		res.json(collection);
	});
});

router.post('/plan/:id', function(req, res, next) {
	var data = JSON.parse(req.body.data);
	dataPlan.findOne({_id:req.params.id}, function(err,collection) {
		//res.render('plan-list',{user:req.user,datas:collection});
		console.log(data);
		collection.plan_course = data.plan_course;
		collection.save(function(err,data){
			if(err){ res.send("Error");}else{res.send("Success");}
		});
	});
});

module.exports = router;
