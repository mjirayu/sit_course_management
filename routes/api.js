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
router.get('/adisak', auth, function(req,res){
	res.send(req.user._id);
});
router.post('/user/plan', auth, function(req, res){
	// dataUser.findOne({auth:req.params.id}, function(err, collection){
	// 	if(err) res.send(err);
	// 	res.send(collection);
	// });
	console.log(req.body);
	data = {
		update_date: new Date(),
		course_id: objectId(req.body.course_id),
		user_id: objectId(req.user._id),
		action: req.body.action
	};
	datayearsemester.findOne({status:'active'}).sort('-year').update({}, { $push: {'courselist':data} }).exec(function(err,collection){
    if(err) res.send(err);
    res.send(collection);
  });

});

router.post('/user/user_profile', auth, function(req,res){
	data = req.body.data;
	if(data){
		dataUser.findOne({_id:req.user._id}).update({}, { $set: {'plan':data} });
		res.send('success');
	}else{
		res.send('error');
	}

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

router.post('/plan',function(req,res,next){



	dataPlan.create(req.body.data,function(err,collection){
		if(err) res.send(err);
		res.send(collection);
	});

});

router.post('/plan/delete/:id',function(req,res,next){



	dataPlan.findById(req.params.id).remove().exec();
	res.redirect('/plan');

});

module.exports = router;
