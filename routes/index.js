var express = require('express');
var router = express.Router();

var auth = require('./../middlewares/auth');
var passport = require('./../middlewares/passport');
var dataPlan = require('./../models/plan');
var dataUser = require('./../models/user_profile');

router.get('/', auth, function(req, res, next) {
	console.log(req.user);
	if (req.user.is_admin == 1) {
		res.render('admin/admin', {username: req.user.username});
	} else {
		dataPlan.find({'student_id': req.user.username}, function(err, collection){
			res.render('plan-list', {user:req.user, datas:collection});
		});
	}
});

router.get('/dnd',function(req,res){
	res.render('./dnd/dnd');
});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/login',function(req, res){
	if(req.user){
		res.redirect('/');
	}else{
		res.render('login');
	}

});

router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	}
));

router.get('/csv', function(req, res) {
	res.render('csv');
});

router.get('/test', function(req, res) {
	dataUser
		.findOne({})
		.populate('auth')
		.exec(function(err, data) {
			res.json(data);
		});
});

module.exports = router;
