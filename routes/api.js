var express = require('express');
var router = express.Router();
var objectId = require('mongoose').Types.ObjectId;
var auth = require('./../middlewares/auth');
var dataPlan = require('./../models/plan');
var dataUser = require('./../models/user_profile');
var dataCourse = require('./../models/course');
var datayearsemester = require('./../models/year_semester');

router.get('/', auth, function(req, res, next) {
	res.redirect('/');
});

router.get('/user/:id', auth, function(req, res, next) {
	dataUser.findOne({auth:req.params.id}, function(err, collection) {
		//res.render('plan-list',{user:req.user,datas:collection});
		res.json(collection);
	});
});

router.post('/user/plan/:id', function(req, res){
	// dataUser.findOne({auth:req.params.id}, function(err, collection){
	// 	if(err) res.send(err);
	// 	res.send(collection);
	// });
	data = {
		update_date: new Date(),
		course_id: objectId(req.body.user_id),
		user_id: objectId(req.body.user_id),
		action: req.body.action
	};
	datayearsemester.findOne({status:'active'}).sort('-year').update({}, { $push: {'courselist':data} }).exec(function(err,collection){
    if(err) res.send(err);
    res.send(collection);
  });

});

router.get('/plan/:id', function(req, res, next) {
	dataPlan.findById(req.params.id, function(err,collection) {
		res.json(collection);
	});
});
router.get('/course', function(req, res) {
	dataCourse.find({}, function(err,collection) {
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
