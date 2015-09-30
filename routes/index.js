var express = require('express');
var router = express.Router();
var passport = require('./../models/auth');
var middleware = require('./../models/middleware');
var mongoose = require('mongoose');
var dataPlan = mongoose.model('plan');

/* GET home page. */
router.get('/', middleware, function(req, res, next) {
	if (req.user.roles[0] == 'admin') {
		res.render('admin/admin', {username: req.user.username});
	} else {
		dataPlan.find({'student_id': req.user.username}, function(err, collection){
			res.render('plan-list', {user:req.user, datas:collection});
		});
	}
});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/login',function(req, res){
	if(req.user){
		res.redirect('/');
	}
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	}
));

module.exports = router;
