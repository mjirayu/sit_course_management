var express = require('express');
var router = express.Router();
var middleware = require('./../models/middleware');
var mongoose = require('mongoose');
var dataplan = mongoose.model('plan');
var datauser = mongoose.model('user');

router.get('/', middleware, function(req, res, next) {
	res.redirect('/');
});

router.get('/:id', middleware, function(req, res, next){
	datauser.findOne({_id:req.params.id}, function(err, collection) {
		//res.render('plan-list',{user:req.user,datas:collection});
		res.json(collection);
	});
});


router.get('/plan/:id',function(req,res,next){
	dataplan.findById(req.params.id, function(err,collection) {
		router.get('/plan/:id',function(req,res,next){
			dataplan.findOne({_id:req.params.id},function(err,collection) {
		//res.render('plan-list',{user:req.user,datas:collection});
			res.json(collection);
	});
});

<<<<<<< HEAD
router.post('/plan/:id',function(req,res,next){
	var data = JSON.parse(req.body.data);
	dataplan.findOne({_id:req.params.id}, function(err,collection) {
		//res.render('plan-list',{user:req.user,datas:collection});
		console.log(data);
		collection.plan_course = data.plan_course;
		collection.save(function(err,data){
			if(err){ res.send("Error");}else{res.send("Success");}
		});
		//console.log(req.body.data);

	});
	// var data = JSON.parse(req.body.data);
	// dataplan.findByIdAndUpdate(
	//     req.params.id,
	//     {$set: {"plan_course": {dd:"sfdfsagd"}}},
	//     {safe: true, upsert: true},
	//     function(err, model) {
	//         console.log(err);
 //    });



});


=======
>>>>>>> d91e69ba2cbb1166e2801d846cea2f33c060eb75
module.exports = router;
